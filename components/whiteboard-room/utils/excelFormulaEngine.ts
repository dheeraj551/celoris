/**
 * Classroom spreadsheet formula engine.
 *
 * Replaces the prototype's regex-based engine, which only understood a
 * formula when the WHOLE cell was one function call — `=SUM(A1:A3)*2`,
 * `=A1+SUM(B1:B3)`, `$A$1` absolute references and VLOOKUP all came back as
 * plain text. This is a small real expression parser (tokenizer + recursive
 * descent) so formulas nest and combine the way they do in Excel.
 *
 * Supported: + - * / ^ & %, comparisons (= <> < > <= >=), parentheses,
 * TRUE/FALSE, "text", A1 / $A$1 / A$1 references and A1:B5 ranges, and:
 *   Math:    SUM PRODUCT AVERAGE(AVG) MIN MAX MEDIAN ROUND ROUNDUP ROUNDDOWN
 *            ABS SQRT POWER MOD INT PI
 *   Count:   COUNT COUNTA COUNTBLANK COUNTIF SUMIF AVERAGEIF
 *   Logic:   IF AND OR NOT IFERROR
 *   Lookup:  VLOOKUP HLOOKUP INDEX MATCH
 *   Text:    CONCAT CONCATENATE LEN UPPER LOWER TRIM LEFT RIGHT MID
 * Errors show as #DIV/0!, #VALUE!, #REF!, #NAME?, #N/A, #NUM!, #CIRCULAR!.
 * Cross-sheet references (Sheet2!A1) aren't supported yet (#REF!).
 */

export interface CellCoord {
  r: number;
  c: number;
  label: string;
}

// ---------------------------------------------------------------- addresses

export function colLetterToIndex(col: string): number {
  let result = 0;
  const upper = col.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    result = result * 26 + (upper.charCodeAt(i) - 64);
  }
  return result - 1;
}

export function indexToColLetter(index: number): string {
  let temp = index + 1;
  let letter = "";
  while (temp > 0) {
    const rem = (temp - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    temp = Math.floor((temp - 1) / 26);
  }
  return letter;
}

/** "B4", "$B$4", "b$4" → {r:3, c:1} */
export function parseCellAddress(addr: string): { r: number; c: number } | null {
  const match = addr.trim().match(/^\$?([A-Za-z]{1,3})\$?(\d+)$/);
  if (!match) return null;
  const r = parseInt(match[2], 10) - 1;
  if (r < 0) return null;
  return { r, c: colLetterToIndex(match[1]) };
}

// ---------------------------------------------------------------- values

type ErrorValue = { error: string };
type Scalar = number | string | boolean | null | ErrorValue; // null = empty cell
type RangeValue = { range: Scalar[][] };
type Value = Scalar | RangeValue;

const err = (code: string): ErrorValue => ({ error: code });
const isErr = (v: unknown): v is ErrorValue => !!v && typeof v === "object" && "error" in (v as object);
const isRange = (v: unknown): v is RangeValue => !!v && typeof v === "object" && "range" in (v as object);

class FormulaError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

/** Numbers typed or imported as text: "1,200", "$5.00", "₹300", "12%". */
function parseLooseNumber(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const pct = t.endsWith("%");
  const clean = t.replace(/[$€£₹,\s]/g, "").replace(/%$/, "");
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(clean)) return null;
  const n = parseFloat(clean);
  return pct ? n / 100 : n;
}

function toNumber(v: Scalar): number {
  if (isErr(v)) throw new FormulaError(v.error);
  if (v === null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  const n = parseLooseNumber(v);
  if (n === null) throw new FormulaError("#VALUE!");
  return n;
}

function toText(v: Scalar): string {
  if (isErr(v)) throw new FormulaError(v.error);
  if (v === null) return "";
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  if (typeof v === "number") return formatNumber(v, false);
  return v;
}

function toBool(v: Scalar): boolean {
  if (isErr(v)) throw new FormulaError(v.error);
  if (v === null) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  const u = v.trim().toUpperCase();
  if (u === "TRUE") return true;
  if (u === "FALSE") return false;
  const n = parseLooseNumber(v);
  if (n !== null) return n !== 0;
  throw new FormulaError("#VALUE!");
}

function flatten(v: Value): Scalar[] {
  if (isRange(v)) return v.range.flat();
  return [v];
}

function scalarOf(v: Value): Scalar {
  // A range used where a single value is expected: take its top-left cell.
  if (isRange(v)) return v.range[0]?.[0] ?? null;
  return v;
}

function formatNumber(num: number, pretty = true): string {
  if (!Number.isFinite(num)) return "#NUM!";
  const rounded = Math.round(num * 1e10) / 1e10;
  if (!pretty) return String(rounded);
  if (Number.isInteger(rounded)) return rounded.toLocaleString();
  return rounded.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

// ---------------------------------------------------------------- tokenizer

type Token =
  | { t: "num"; v: number }
  | { t: "str"; v: string }
  | { t: "bool"; v: boolean }
  | { t: "ref"; r: number; c: number }
  | { t: "range"; r1: number; c1: number; r2: number; c2: number }
  | { t: "func"; name: string }
  | { t: "op"; v: string }
  | { t: "(" }
  | { t: ")" }
  | { t: "," };

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      // Excel uses "..." ("" escapes a quote); the prototype's samples also
      // used '...', so accept both.
      let j = i + 1;
      let out = "";
      while (j < src.length) {
        if (src[j] === ch) {
          if (src[j + 1] === ch) {
            out += ch;
            j += 2;
            continue;
          }
          break;
        }
        out += src[j++];
      }
      if (j >= src.length) throw new FormulaError("#VALUE!");
      tokens.push({ t: "str", v: out });
      i = j + 1;
      continue;
    }
    const num = src.slice(i).match(/^(\d+\.?\d*|\.\d+)(e[-+]?\d+)?/i);
    if (num) {
      tokens.push({ t: "num", v: parseFloat(num[0]) });
      i += num[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      const rest = src.slice(i);
      // Range  A1:B5 / $A$1:B$5
      const range = rest.match(/^(\$?[A-Za-z]{1,3}\$?\d+)\s*:\s*(\$?[A-Za-z]{1,3}\$?\d+)/);
      if (range) {
        const a = parseCellAddress(range[1])!;
        const b = parseCellAddress(range[2])!;
        tokens.push({
          t: "range",
          r1: Math.min(a.r, b.r),
          c1: Math.min(a.c, b.c),
          r2: Math.max(a.r, b.r),
          c2: Math.max(a.c, b.c),
        });
        i += range[0].length;
        continue;
      }
      const word = rest.match(/^[A-Za-z_][A-Za-z0-9_.]*/);
      const ref = rest.match(/^\$?[A-Za-z]{1,3}\$?\d+/);
      if (word) {
        const after = rest.slice(word[0].length).trimStart();
        // A word followed by "(" is a function call.
        if (after.startsWith("(")) {
          tokens.push({ t: "func", name: word[0].toUpperCase() });
          i += word[0].length;
          continue;
        }
        if (after.startsWith("!")) throw new FormulaError("#REF!"); // Sheet2!A1
      }
      if (ref && (!word || ref[0].length >= word[0].length || ref[0].includes("$"))) {
        const a = parseCellAddress(ref[0])!;
        tokens.push({ t: "ref", r: a.r, c: a.c });
        i += ref[0].length;
        continue;
      }
      if (word) {
        const u = word[0].toUpperCase();
        if (u === "TRUE" || u === "FALSE") {
          tokens.push({ t: "bool", v: u === "TRUE" });
          i += word[0].length;
          continue;
        }
      }
      throw new FormulaError("#NAME?");
    }
    const two = src.slice(i, i + 2);
    if (two === "<=" || two === ">=" || two === "<>" || two === "==" || two === "!=") {
      tokens.push({ t: "op", v: two === "==" ? "=" : two === "!=" ? "<>" : two });
      i += 2;
      continue;
    }
    if ("+-*/^&%=<>".includes(ch)) {
      tokens.push({ t: "op", v: ch });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ t: "(" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ t: ")" });
      i++;
      continue;
    }
    if (ch === "," || ch === ";") {
      tokens.push({ t: "," });
      i++;
      continue;
    }
    throw new FormulaError("#VALUE!");
  }
  return tokens;
}

// ---------------------------------------------------------------- evaluator

interface Ctx {
  rows: string[][];
  cache: Map<string, Scalar>;
  stack: Set<string>;
}

function cellValue(ctx: Ctx, r: number, c: number): Scalar {
  if (r < 0 || c < 0 || r > 100000 || c > 16384) return err("#REF!");
  const key = `${r},${c}`;
  if (ctx.cache.has(key)) return ctx.cache.get(key)!;
  if (ctx.stack.has(key)) return err("#CIRCULAR!");
  const raw = ctx.rows[r]?.[c];
  let v: Scalar;
  if (raw === undefined || raw === null || raw === "") {
    v = null;
  } else if (typeof raw === "string" && raw.startsWith("=")) {
    ctx.stack.add(key);
    v = evalFormulaValue(raw.slice(1), ctx);
    ctx.stack.delete(key);
  } else {
    const s = String(raw);
    const n = parseLooseNumber(s);
    const u = s.trim().toUpperCase();
    v = n !== null ? n : u === "TRUE" ? true : u === "FALSE" ? false : s;
  }
  ctx.cache.set(key, v);
  return v;
}

function evalFormulaValue(expr: string, ctx: Ctx): Scalar {
  try {
    const tokens = tokenize(expr);
    if (tokens.length === 0) return null;
    const parser = new Parser(tokens, ctx);
    const v = parser.parseExpression();
    if (!parser.done()) throw new FormulaError("#VALUE!");
    return scalarOf(v);
  } catch (e) {
    if (e instanceof FormulaError) return err(e.code);
    return err("#VALUE!");
  }
}

class Parser {
  private pos = 0;
  constructor(private tokens: Token[], private ctx: Ctx) {}

  done() {
    return this.pos >= this.tokens.length;
  }
  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }
  private next(): Token {
    const t = this.tokens[this.pos++];
    if (!t) throw new FormulaError("#VALUE!");
    return t;
  }
  private takeOp(...ops: string[]): string | null {
    const t = this.peek();
    if (t && t.t === "op" && ops.includes(t.v)) {
      this.pos++;
      return t.v;
    }
    return null;
  }

  parseExpression(): Value {
    return this.parseComparison();
  }

  private parseComparison(): Value {
    let left = this.parseConcat();
    let op: string | null;
    while ((op = this.takeOp("=", "<>", "<", ">", "<=", ">="))) {
      const right = this.parseConcat();
      left = compare(scalarOf(left), scalarOf(right), op);
    }
    return left;
  }

  private parseConcat(): Value {
    let left = this.parseAdditive();
    while (this.takeOp("&")) {
      const right = this.parseAdditive();
      left = toText(scalarOf(left)) + toText(scalarOf(right));
    }
    return left;
  }

  private parseAdditive(): Value {
    let left = this.parseMultiplicative();
    let op: string | null;
    while ((op = this.takeOp("+", "-"))) {
      const right = this.parseMultiplicative();
      const a = toNumber(scalarOf(left));
      const b = toNumber(scalarOf(right));
      left = op === "+" ? a + b : a - b;
    }
    return left;
  }

  private parseMultiplicative(): Value {
    let left = this.parsePower();
    let op: string | null;
    while ((op = this.takeOp("*", "/"))) {
      const right = this.parsePower();
      const a = toNumber(scalarOf(left));
      const b = toNumber(scalarOf(right));
      if (op === "/" && b === 0) throw new FormulaError("#DIV/0!");
      left = op === "*" ? a * b : a / b;
    }
    return left;
  }

  private parsePower(): Value {
    let left = this.parseUnary();
    while (this.takeOp("^")) {
      const right = this.parseUnary();
      left = Math.pow(toNumber(scalarOf(left)), toNumber(scalarOf(right)));
    }
    return left;
  }

  private parseUnary(): Value {
    if (this.takeOp("-")) return -toNumber(scalarOf(this.parseUnary()));
    if (this.takeOp("+")) return toNumber(scalarOf(this.parseUnary()));
    return this.parsePostfix();
  }

  private parsePostfix(): Value {
    let v = this.parsePrimary();
    while (this.takeOp("%")) {
      v = toNumber(scalarOf(v)) / 100;
    }
    return v;
  }

  private parsePrimary(): Value {
    const t = this.next();
    switch (t.t) {
      case "num":
      case "str":
      case "bool":
        return t.v;
      case "ref": {
        const v = cellValue(this.ctx, t.r, t.c);
        if (isErr(v)) throw new FormulaError(v.error);
        return v;
      }
      case "range": {
        if ((t.r2 - t.r1 + 1) * (t.c2 - t.c1 + 1) > 50000) throw new FormulaError("#REF!");
        const range: Scalar[][] = [];
        for (let r = t.r1; r <= t.r2; r++) {
          const row: Scalar[] = [];
          for (let c = t.c1; c <= t.c2; c++) row.push(cellValue(this.ctx, r, c));
          range.push(row);
        }
        return { range };
      }
      case "(": {
        const v = this.parseExpression();
        if (this.next().t !== ")") throw new FormulaError("#VALUE!");
        return v;
      }
      case "func":
        return this.parseFunction(t.name);
      default:
        throw new FormulaError("#VALUE!");
    }
  }

  private parseFunction(name: string): Value {
    if (this.next().t !== "(") throw new FormulaError("#VALUE!");
    // Collect each argument's tokens and evaluate lazily, so IF / IFERROR
    // only evaluate the branch they need.
    const argSlices: Token[][] = [];
    let depth = 0;
    let current: Token[] = [];
    for (;;) {
      const t = this.next();
      if (t.t === "(") {
        depth++;
        current.push(t);
      } else if (t.t === ")") {
        if (depth === 0) break;
        depth--;
        current.push(t);
      } else if (t.t === "," && depth === 0) {
        argSlices.push(current);
        current = [];
      } else {
        current.push(t);
      }
    }
    if (current.length > 0 || argSlices.length > 0) argSlices.push(current);

    const evalArg = (i: number): Value => {
      const slice = argSlices[i];
      if (!slice || slice.length === 0) return null;
      const p = new Parser(slice, this.ctx);
      const v = p.parseExpression();
      if (!p.done()) throw new FormulaError("#VALUE!");
      return v;
    };
    const arg = (i: number): Scalar => {
      const v = scalarOf(evalArg(i));
      if (isErr(v)) throw new FormulaError(v.error);
      return v;
    };
    return callFunction(name, argSlices.length, evalArg, arg);
  }
}

function compare(a: Scalar, b: Scalar, op: string): boolean {
  if (isErr(a)) throw new FormulaError(a.error);
  if (isErr(b)) throw new FormulaError(b.error);
  const asNum = (v: Scalar) =>
    v === null ? 0 : typeof v === "number" ? v : typeof v === "string" ? parseLooseNumber(v) : null;
  const na = asNum(a);
  const nb = asNum(b);
  let cmp: number;
  if (na !== null && nb !== null) {
    cmp = na === nb ? 0 : na < nb ? -1 : 1;
  } else {
    const sa = toText(a).toLowerCase();
    const sb = toText(b).toLowerCase();
    cmp = sa === sb ? 0 : sa < sb ? -1 : 1;
  }
  switch (op) {
    case "=":
      return cmp === 0;
    case "<>":
      return cmp !== 0;
    case "<":
      return cmp < 0;
    case ">":
      return cmp > 0;
    case "<=":
      return cmp <= 0;
    case ">=":
      return cmp >= 0;
  }
  return false;
}

/** SUMIF/COUNTIF criteria: 50, ">=50", "<>Pass", "Pass" */
function matchesCriteria(value: Scalar, criteria: Scalar): boolean {
  if (isErr(value)) return false;
  if (typeof criteria === "number" || typeof criteria === "boolean") {
    return value !== null && compare(value, criteria, "=");
  }
  const c = toText(criteria);
  const m = c.match(/^(<=|>=|<>|=|<|>)(.*)$/);
  const op = m ? m[1] : "=";
  const rhsRaw = m ? m[2] : c;
  if (rhsRaw === "") {
    const blank = value === null || value === "";
    return op === "<>" ? !blank : blank;
  }
  if (value === null) return op === "<>";
  const rhsNum = parseLooseNumber(rhsRaw);
  try {
    return compare(value, rhsNum !== null ? rhsNum : rhsRaw, op);
  } catch {
    return false;
  }
}

/** SUM/AVERAGE/...: numbers inside ranges (text and blanks skipped, like
 *  Excel), plus direct arguments converted, e.g. SUM(1, "2"). */
function aggregateNumbers(argCount: number, evalArg: (i: number) => Value): number[] {
  const out: number[] = [];
  for (let i = 0; i < argCount; i++) {
    const v = evalArg(i);
    if (isRange(v)) {
      for (const cell of v.range.flat()) {
        if (isErr(cell)) throw new FormulaError(cell.error);
        if (typeof cell === "number") out.push(cell);
      }
    } else if (v !== null) {
      out.push(toNumber(v));
    }
  }
  return out;
}

function transpose(grid: Scalar[][]): Scalar[][] {
  const cols = grid[0]?.length || 0;
  const out: Scalar[][] = [];
  for (let c = 0; c < cols; c++) out.push(grid.map((row) => row[c]));
  return out;
}

function callFunction(
  name: string,
  argCount: number,
  evalArg: (i: number) => Value,
  arg: (i: number) => Scalar
): Value {
  const need = (min: number, max = min) => {
    if (argCount < min || argCount > max) throw new FormulaError("#VALUE!");
  };
  const roundTo = (n: number, digits: number, mode: "round" | "up" | "down") => {
    const f = Math.pow(10, digits);
    const x = Math.abs(n) * f;
    const r = mode === "round" ? Math.round(x + 1e-9) : mode === "up" ? Math.ceil(x - 1e-9) : Math.floor(x + 1e-9);
    return (Math.sign(n) * r) / f;
  };
  const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);

  switch (name) {
    case "SUM":
      return sum(aggregateNumbers(argCount, evalArg));
    case "PRODUCT": {
      const nums = aggregateNumbers(argCount, evalArg);
      return nums.length ? nums.reduce((a, b) => a * b, 1) : 0;
    }
    case "AVERAGE":
    case "AVG": {
      const nums = aggregateNumbers(argCount, evalArg);
      if (!nums.length) throw new FormulaError("#DIV/0!");
      return sum(nums) / nums.length;
    }
    case "MIN": {
      const nums = aggregateNumbers(argCount, evalArg);
      return nums.length ? Math.min(...nums) : 0;
    }
    case "MAX": {
      const nums = aggregateNumbers(argCount, evalArg);
      return nums.length ? Math.max(...nums) : 0;
    }
    case "MEDIAN": {
      const nums = aggregateNumbers(argCount, evalArg).sort((a, b) => a - b);
      if (!nums.length) throw new FormulaError("#NUM!");
      const mid = Math.floor(nums.length / 2);
      return nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    }
    case "COUNT": {
      let n = 0;
      for (let i = 0; i < argCount; i++) for (const v of flatten(evalArg(i))) if (typeof v === "number") n++;
      return n;
    }
    case "COUNTA": {
      let n = 0;
      for (let i = 0; i < argCount; i++) for (const v of flatten(evalArg(i))) if (v !== null && v !== "") n++;
      return n;
    }
    case "COUNTBLANK":
      need(1);
      return flatten(evalArg(0)).filter((v) => v === null || v === "").length;
    case "COUNTIF": {
      need(2);
      const crit = arg(1);
      return flatten(evalArg(0)).filter((v) => matchesCriteria(v, crit)).length;
    }
    case "SUMIF":
    case "AVERAGEIF": {
      need(2, 3);
      const testCells = flatten(evalArg(0));
      const crit = arg(1);
      const targetCells = argCount === 3 ? flatten(evalArg(2)) : testCells;
      const picked: number[] = [];
      testCells.forEach((v, i) => {
        const target = targetCells[i];
        if (matchesCriteria(v, crit) && typeof target === "number") picked.push(target);
      });
      if (name === "SUMIF") return sum(picked);
      if (!picked.length) throw new FormulaError("#DIV/0!");
      return sum(picked) / picked.length;
    }
    case "ROUND":
    case "ROUNDUP":
    case "ROUNDDOWN": {
      need(1, 2);
      const digits = argCount > 1 ? Math.trunc(toNumber(arg(1))) : 0;
      return roundTo(toNumber(arg(0)), digits, name === "ROUND" ? "round" : name === "ROUNDUP" ? "up" : "down");
    }
    case "ABS":
      need(1);
      return Math.abs(toNumber(arg(0)));
    case "SQRT": {
      need(1);
      const n = toNumber(arg(0));
      if (n < 0) throw new FormulaError("#NUM!");
      return Math.sqrt(n);
    }
    case "POWER":
      need(2);
      return Math.pow(toNumber(arg(0)), toNumber(arg(1)));
    case "MOD": {
      need(2);
      const a = toNumber(arg(0));
      const b = toNumber(arg(1));
      if (b === 0) throw new FormulaError("#DIV/0!");
      return a - b * Math.floor(a / b);
    }
    case "INT":
      need(1);
      return Math.floor(toNumber(arg(0)));
    case "PI":
      need(0);
      return Math.PI;
    case "IF":
      need(2, 3);
      return toBool(arg(0)) ? evalArg(1) : argCount > 2 ? evalArg(2) : false;
    case "IFERROR": {
      need(2);
      try {
        const v = scalarOf(evalArg(0));
        return isErr(v) ? evalArg(1) : v;
      } catch (e) {
        if (e instanceof FormulaError) return evalArg(1);
        throw e;
      }
    }
    case "AND":
    case "OR": {
      if (argCount < 1) throw new FormulaError("#VALUE!");
      const bools: boolean[] = [];
      for (let i = 0; i < argCount; i++) for (const v of flatten(evalArg(i))) if (v !== null) bools.push(toBool(v));
      return name === "AND" ? bools.every(Boolean) : bools.some(Boolean);
    }
    case "NOT":
      need(1);
      return !toBool(arg(0));
    case "VLOOKUP":
    case "HLOOKUP": {
      need(3, 4);
      const key = arg(0);
      const table = evalArg(1);
      if (!isRange(table)) throw new FormulaError("#VALUE!");
      const idx = Math.trunc(toNumber(arg(2))) - 1;
      const approximate = argCount < 4 ? true : toBool(arg(3));
      const grid = name === "VLOOKUP" ? table.range : transpose(table.range);
      if (idx < 0 || idx >= (grid[0]?.length || 0)) throw new FormulaError("#REF!");
      let found = -1;
      if (!approximate) {
        found = grid.findIndex((row) => row[0] !== null && !isErr(row[0]) && compare(row[0], key, "="));
      } else {
        // Sorted-ascending lookup: last row whose key is <= the search key.
        for (let i = 0; i < grid.length; i++) {
          const k = grid[i][0];
          if (k === null || isErr(k)) continue;
          if (compare(k, key, "<=")) found = i;
          else break;
        }
      }
      if (found < 0) throw new FormulaError("#N/A");
      return grid[found][idx];
    }
    case "INDEX": {
      need(2, 3);
      const table = evalArg(0);
      const grid = isRange(table) ? table.range : [[scalarOf(table)]];
      let r = Math.trunc(toNumber(arg(1))) - 1;
      let c = argCount > 2 ? Math.trunc(toNumber(arg(2))) - 1 : 0;
      if (grid.length === 1 && argCount === 2) {
        c = r;
        r = 0;
      }
      const v = grid[r]?.[c];
      if (v === undefined) throw new FormulaError("#REF!");
      return v;
    }
    case "MATCH": {
      need(2, 3);
      const key = arg(0);
      const cells = flatten(evalArg(1));
      const type = argCount > 2 ? Math.trunc(toNumber(arg(2))) : 1;
      let found = -1;
      cells.forEach((v, i) => {
        if (v === null || isErr(v)) return;
        if (type === 0) {
          if (found < 0 && compare(v, key, "=")) found = i;
        } else if (type === 1) {
          if (compare(v, key, "<=")) found = i;
        } else if (compare(v, key, ">=")) {
          found = i;
        }
      });
      if (found < 0) throw new FormulaError("#N/A");
      return found + 1;
    }
    case "CONCAT":
    case "CONCATENATE": {
      let out = "";
      for (let i = 0; i < argCount; i++) for (const v of flatten(evalArg(i))) out += toText(v);
      return out;
    }
    case "LEN":
      need(1);
      return toText(arg(0)).length;
    case "UPPER":
      need(1);
      return toText(arg(0)).toUpperCase();
    case "LOWER":
      need(1);
      return toText(arg(0)).toLowerCase();
    case "TRIM":
      need(1);
      return toText(arg(0)).trim().replace(/\s+/g, " ");
    case "LEFT":
    case "RIGHT": {
      need(1, 2);
      const s = toText(arg(0));
      const n = argCount > 1 ? Math.max(0, Math.trunc(toNumber(arg(1)))) : 1;
      return name === "LEFT" ? s.slice(0, n) : n === 0 ? "" : s.slice(-n);
    }
    case "MID": {
      need(3);
      const s = toText(arg(0));
      const start = Math.trunc(toNumber(arg(1)));
      const len = Math.trunc(toNumber(arg(2)));
      if (start < 1 || len < 0) throw new FormulaError("#VALUE!");
      return s.slice(start - 1, start - 1 + len);
    }
  }
  throw new FormulaError("#NAME?");
}

// ---------------------------------------------------------------- public API

// One cache per sheet snapshot, so rendering a grid of N cells doesn't
// re-evaluate every dependency chain N times. Cell edits create a new rows
// array (immutable updates), which naturally starts a fresh cache.
const sheetCaches = new WeakMap<string[][], Map<string, Scalar>>();

function displayValue(v: Scalar): string {
  if (v === null) return "";
  if (isErr(v)) return v.error;
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  if (typeof v === "number") return formatNumber(v);
  return v;
}

/**
 * What a cell should display. Non-formula values are returned unchanged.
 * (Signature kept from the prototype engine; the third argument is unused.)
 */
export function evaluateFormula(val: string, allRows: string[][], _visited?: Set<string>): string {
  if (!val || typeof val !== "string" || !val.startsWith("=")) {
    return val ?? "";
  }
  let cache = sheetCaches.get(allRows);
  if (!cache) {
    cache = new Map();
    sheetCaches.set(allRows, cache);
  }
  const ctx: Ctx = { rows: allRows, cache, stack: new Set() };
  return displayValue(evalFormulaValue(val.slice(1), ctx));
}

/**
 * Cells/ranges a formula refers to — drives the blue highlight that shows
 * students which cells a formula is using.
 */
export function extractReferencedCells(formula: string): {
  cells: CellCoord[];
  ranges: { start: CellCoord; end: CellCoord }[];
} {
  const cells: CellCoord[] = [];
  const ranges: { start: CellCoord; end: CellCoord }[] = [];
  if (!formula || !formula.startsWith("=")) return { cells, ranges };
  let tokens: Token[];
  try {
    tokens = tokenize(formula.slice(1));
  } catch {
    return { cells, ranges };
  }
  const label = (r: number, c: number) => `${indexToColLetter(c)}${r + 1}`;
  for (const t of tokens) {
    if (t.t === "ref") {
      cells.push({ r: t.r, c: t.c, label: label(t.r, t.c) });
    } else if (t.t === "range") {
      ranges.push({
        start: { r: t.r1, c: t.c1, label: label(t.r1, t.c1) },
        end: { r: t.r2, c: t.c2, label: label(t.r2, t.c2) },
      });
      if ((t.r2 - t.r1 + 1) * (t.c2 - t.c1 + 1) <= 2500) {
        for (let r = t.r1; r <= t.r2; r++) for (let c = t.c1; c <= t.c2; c++) cells.push({ r, c, label: label(r, c) });
      }
    }
  }
  return { cells, ranges };
}
