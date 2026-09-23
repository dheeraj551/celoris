import type { ExcelSheet, SlideData } from "../types";
import { evaluateFormula } from "./excelFormulaEngine";

// File parsing runs only in the trainer's browser. The heavy libraries are
// loaded on demand so they don't weigh down the room for students.

const MAX_IMPORT_ROWS = 500;
const MAX_IMPORT_COLS = 40;

function columnLetters(count: number): string[] {
  const out: string[] = [];
  for (let c = 0; c < count; c++) {
    let n = c + 1;
    let s = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      s = String.fromCharCode(65 + rem) + s;
      n = Math.floor((n - 1) / 26);
    }
    out.push(s);
  }
  return out;
}

/**
 * Reads a real .xlsx / .xls / .csv. Unlike the prototype (which kept only
 * the computed values), formulas are preserved as "=SUM(...)" so students
 * can click a cell and see how it was calculated.
 */
export async function parseExcelFile(file: File): Promise<{ fileName: string; sheets: ExcelSheet[]; truncated: boolean }> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true, cellFormula: true });

  const parsedSheets: ExcelSheet[] = [];
  let truncated = false;

  for (const sheetName of workbook.SheetNames) {
    const ws = workbook.Sheets[sheetName];
    if (!ws || !ws["!ref"]) {
      parsedSheets.push({ name: sheetName, columns: columnLetters(5), rows: [["", "", "", "", ""]] });
      continue;
    }
    const range = XLSX.utils.decode_range(ws["!ref"]);
    const lastRow = Math.min(range.e.r, MAX_IMPORT_ROWS - 1);
    const lastCol = Math.min(range.e.c, MAX_IMPORT_COLS - 1);
    if (range.e.r > lastRow || range.e.c > lastCol) truncated = true;

    const colCount = Math.max(lastCol + 1, 5);
    const rows: string[][] = [];
    for (let r = 0; r <= lastRow; r++) {
      const row: string[] = [];
      for (let c = 0; c < colCount; c++) {
        const cell = ws[XLSX.utils.encode_cell({ r, c })];
        if (!cell) {
          row.push("");
        } else if (cell.f) {
          row.push(`=${cell.f}`);
        } else if (cell.w !== undefined) {
          row.push(String(cell.w));
        } else {
          row.push(cell.v === undefined || cell.v === null ? "" : String(cell.v));
        }
      }
      rows.push(row);
    }
    while (rows.length < 6) rows.push(new Array(colCount).fill(""));

    parsedSheets.push({ name: sheetName, columns: columnLetters(colCount), rows });
  }

  return {
    fileName: file.name,
    truncated,
    sheets: parsedSheets.length > 0 ? parsedSheets : [{ name: "Sheet1", columns: columnLetters(5), rows: [["", "", "", "", ""]] }],
  };
}

/**
 * Downloads the board's sheets as a real .xlsx. Formulas are written as
 * Excel formulas (with the current result cached, so the file shows values
 * even before Excel recalculates) and numbers as numbers — the prototype
 * wrote everything, formulas included, as plain text.
 */
export async function exportExcelWorkbook(fileName: string, sheets: ExcelSheet[]) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const usedNames = new Set<string>();

  for (const sheet of sheets) {
    const aoa = sheet.rows.map((row) =>
      row.map((raw) => {
        const value = raw ?? "";
        if (value.startsWith("=")) {
          const shown = evaluateFormula(value, sheet.rows);
          const cleaned = shown.replace(/,/g, "");
          const num = Number(cleaned);
          const isNum = cleaned !== "" && Number.isFinite(num);
          return isNum
            ? { t: "n", f: value.slice(1), v: num }
            : { t: "s", f: value.slice(1), v: shown };
        }
        const cleaned = value.replace(/,/g, "").trim();
        if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return Number(cleaned);
        return value;
      })
    );
    const ws = XLSX.utils.aoa_to_sheet(aoa as any);
    let name = (sheet.name || "Sheet").replace(/[\\/?*[\]:]/g, " ").slice(0, 31) || "Sheet";
    while (usedNames.has(name)) name = `${name.slice(0, 28)}_${usedNames.size}`;
    usedNames.add(name);
    XLSX.utils.book_append_sheet(wb, ws, name);
  }

  const cleanName = fileName.toLowerCase().endsWith(".xlsx") ? fileName : `${fileName.replace(/\.(xls|csv)$/i, "")}.xlsx`;
  XLSX.writeFile(wb, cleanName);
}

/** Word (.docx) → HTML via mammoth. Rendering is sanitised in WordCard. */
export async function parseWordFile(file: File): Promise<{ fileName: string; docTitle: string; htmlContent: string }> {
  const mammoth = (await import("mammoth")).default;
  const buffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
  const rawTitle = file.name.replace(/\.[^/.]+$/, "");

  let html = result.value || "";
  // Embedded pictures come through as base64 and can make a document too
  // big to share on the board — keep the text, drop the pictures.
  if (html.length > 700_000) {
    html =
      html.replace(/<img[^>]*>/gi, "") +
      `<p><em>Pictures from this document were left out because they were too large to share on the board. Paste them in as separate images instead.</em></p>`;
  }
  if (html.length > 800_000) {
    throw new Error("This document is too long to share on the board. Try splitting it or sharing your screen instead.");
  }
  if (!html.trim()) {
    html = `<p><em>"${file.name.replace(/[<>&"]/g, "")}" opened, but it doesn't contain any text.</em></p>`;
  }

  return { fileName: file.name, docTitle: rawTitle, htmlContent: html };
}

/**
 * PowerPoint (.pptx): extracts each slide's TEXT and speaker notes and shows
 * them in the board's own slide layout. Pictures, charts and the original
 * design are not reproduced — for a faithful deck, share your screen.
 */
export async function parsePptxFile(file: File): Promise<{ deckTitle: string; slides: SlideData[] }> {
  const JSZip = (await import("jszip")).default;
  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);

  const slideFiles = Object.keys(zip.files).filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name));
  slideFiles.sort((a, b) => (parseInt(a.replace(/\D/g, ""), 10) || 0) - (parseInt(b.replace(/\D/g, ""), 10) || 0));

  const slides: SlideData[] = [];
  const deckTitle = file.name.replace(/\.[^/.]+$/, "");
  const parser = new DOMParser();

  for (let i = 0; i < slideFiles.length; i++) {
    const slidePath = slideFiles[i];
    const xmlText = await zip.files[slidePath].async("string");
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const pNodes = xmlDoc.getElementsByTagName("a:p");
    const slideTexts: string[] = [];
    for (let pIdx = 0; pIdx < pNodes.length; pIdx++) {
      const tNodes = pNodes[pIdx].getElementsByTagName("a:t");
      let paragraphText = "";
      for (let tIdx = 0; tIdx < tNodes.length; tIdx++) paragraphText += tNodes[tIdx].textContent || "";
      paragraphText = paragraphText.trim();
      if (paragraphText) slideTexts.push(paragraphText.slice(0, 500));
    }

    let presenterNotes = "";
    const slideNum = slidePath.replace(/\D/g, "");
    const notePath = `ppt/notesSlides/notesSlide${slideNum}.xml`;
    if (zip.files[notePath]) {
      try {
        const noteXml = await zip.files[notePath].async("string");
        const noteDoc = parser.parseFromString(noteXml, "application/xml");
        const noteNodes = noteDoc.getElementsByTagName("a:t");
        const noteParts: string[] = [];
        for (let n = 0; n < noteNodes.length; n++) {
          const txt = noteNodes[n].textContent?.trim();
          // Skip the slide-number placeholder that notes pages carry.
          if (txt && txt !== slideNum) noteParts.push(txt);
        }
        presenterNotes = noteParts.join(" ").slice(0, 2000);
      } catch {
        // Notes are optional.
      }
    }

    let title = `Slide ${i + 1}`;
    let subtitle: string | undefined;
    const bullets: string[] = [];
    if (slideTexts.length > 0) {
      title = slideTexts[0];
      if (i === 0 && slideTexts.length === 2) {
        subtitle = slideTexts[1];
      } else {
        bullets.push(...slideTexts.slice(1, 12));
      }
    }

    slides.push({
      title,
      subtitle,
      bullets: bullets.length > 0 ? bullets : undefined,
      presenterNotes: presenterNotes || undefined,
      bgTheme: i === 0 ? "navy" : "light",
    });
  }

  if (slides.length === 0) {
    slides.push({
      title: deckTitle,
      subtitle: "This presentation has no text we could read",
      bullets: ["Share your screen to present slides that are mostly pictures."],
      bgTheme: "navy",
    });
  }

  return { deckTitle, slides };
}
