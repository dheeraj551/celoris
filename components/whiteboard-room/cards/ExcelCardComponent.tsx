"use client";

import React, { useState, useRef } from "react";
import { ExcelCard, ViewportTransform, ExcelSheet } from "../types";
import { CardWrapper } from "./CardWrapper";
import {
  Table,
  Plus,
  Trash2,
  Calculator,
  Download,
  Upload,
  BookOpen,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronRight,
  Check,
} from "lucide-react";
import { parseExcelFile, exportExcelWorkbook } from "../utils/fileParsers";
import { useBoardReadOnly } from "../boardContext";
import {
  evaluateFormula,
  extractReferencedCells,
  indexToColLetter,
} from "../utils/excelFormulaEngine";

interface ExcelCardProps {
  card: ExcelCard;
  viewport: ViewportTransform;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (cardId: string, updates: any) => void;
  onDelete: (cardId: string) => void;
}

export const ExcelCardComponent: React.FC<ExcelCardProps> = ({
  card,
  viewport,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const readOnly = useBoardReadOnly();
  const { sheets, sourceType } = card.data;
  // Students can flip between sheets on their own screen without changing
  // what the trainer (or anyone else) is looking at.
  const [localSheetIndex, setLocalSheetIndex] = useState<number | null>(null);
  const activeSheetIndex = readOnly && localSheetIndex !== null ? localSheetIndex : card.data.activeSheetIndex;
  const currentSheet = sheets[activeSheetIndex] || sheets[0] || {
    name: "Sheet1",
    columns: ["A", "B", "C", "D"],
    rows: [["", "", "", ""]],
  };

  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [editingValue, setEditingValue] = useState("");
  const [showFormulaGuide, setShowFormulaGuide] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getColLabel = (index: number) => {
    return currentSheet.columns[index] || indexToColLetter(index);
  };

  const activeCellCoord = `${getColLabel(selectedCell.c)}${selectedCell.r + 1}`;
  const activeCellValue = currentSheet.rows[selectedCell.r]?.[selectedCell.c] ?? "";

  // Extract referenced cells for visual color highlighting on the grid
  const currentFormula = editingValue || activeCellValue;
  const { cells: referencedCells } = extractReferencedCells(currentFormula);
  const refCellSet = new Set(referencedCells.map((coord) => `${coord.r},${coord.c}`));

  const handleCellChange = (r: number, c: number, newVal: string) => {
    if (readOnly) return;
    const updatedSheets = [...sheets];
    const newRows = currentSheet.rows.map((row) => [...row]);
    if (!newRows[r]) newRows[r] = [];
    newRows[r][c] = newVal;

    updatedSheets[activeSheetIndex] = {
      ...currentSheet,
      rows: newRows,
    };

    onUpdate(card.id, {
      data: {
        ...card.data,
        sheets: updatedSheets,
      },
    });
  };

  const handleAddRow = () => {
    const updatedSheets = [...sheets];
    const emptyRow = new Array(currentSheet.columns.length).fill("");
    const newRows = [...currentSheet.rows, emptyRow];

    updatedSheets[activeSheetIndex] = {
      ...currentSheet,
      rows: newRows,
    };

    onUpdate(card.id, {
      data: {
        ...card.data,
        sheets: updatedSheets,
      },
    });
  };

  const handleAddCol = () => {
    const updatedSheets = [...sheets];
    const nextCol = indexToColLetter(currentSheet.columns.length);
    const newCols = [...currentSheet.columns, nextCol];
    const newRows = currentSheet.rows.map((r) => [...r, ""]);

    updatedSheets[activeSheetIndex] = {
      ...currentSheet,
      columns: newCols,
      rows: newRows,
    };

    onUpdate(card.id, {
      data: {
        ...card.data,
        sheets: updatedSheets,
      },
    });
  };

  // Upload genuine .xlsx, .xls, .csv file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingFile(true);
    setStatusMessage(`Parsing ${file.name}...`);

    try {
      const parsed = await parseExcelFile(file);
      onUpdate(card.id, {
        title: file.name,
        data: {
          ...card.data,
          fileName: parsed.fileName,
          sheets: parsed.sheets,
          activeSheetIndex: 0,
          sourceType: "native",
        },
      });
      setSelectedCell({ r: 0, c: 0 });
      setStatusMessage(
        parsed.truncated
          ? `Loaded "${file.name}" — showing the first 500 rows × 40 columns`
          : `Loaded "${file.name}" with ${parsed.sheets.length} sheet(s)!`
      );
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      setStatusMessage(`Failed to read file: ${err.message}`);
    } finally {
      setIsLoadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Export to .xlsx file
  const handleExport = () => {
    exportExcelWorkbook(card.data.fileName || "Spreadsheet.xlsx", sheets).catch((err: any) => {
      setStatusMessage(`Export failed: ${err?.message || "unknown error"}`);
      setTimeout(() => setStatusMessage(null), 3500);
    });
  };

  // Preset educational template loader
  const loadEducationalTemplate = (type: "grades" | "budget" | "science") => {
    let templateSheet: ExcelSheet;

    if (type === "grades") {
      templateSheet = {
        name: "Student Grades",
        columns: ["A", "B", "C", "D", "E", "F"],
        rows: [
          ["Student Name", "Quiz 1 (30)", "Midterm (50)", "Final (100)", "Total Score", "Status"],
          ["Alice Johnson", "28", "45", "92", "=SUM(B2:D2)", '=IF(E2>=140, "Pass", "Retake")'],
          ["Bob Smith", "22", "38", "78", "=SUM(B3:D3)", '=IF(E3>=140, "Pass", "Retake")'],
          ["Charlie Davis", "18", "25", "60", "=SUM(B4:D4)", '=IF(E4>=140, "Pass", "Retake")'],
          ["Diana Prince", "30", "49", "98", "=SUM(B5:D5)", '=IF(E5>=140, "Pass", "Retake")'],
          ["Class Average", "=AVERAGE(B2:B5)", "=AVERAGE(C2:C5)", "=AVERAGE(D2:D5)", "=AVERAGE(E2:E5)", "-"],
          ["Highest Score", "=MAX(B2:B5)", "=MAX(C2:C5)", "=MAX(D2:D5)", "=MAX(E2:E5)", "-"],
          ["Lowest Score", "=MIN(B2:B5)", "=MIN(C2:C5)", "=MIN(D2:D5)", "=MIN(E2:E5)", "-"],
        ],
      };
    } else if (type === "budget") {
      templateSheet = {
        name: "Class Budget",
        columns: ["A", "B", "C", "D"],
        rows: [
          ["Category", "Allocated ($)", "Spent ($)", "Remaining ($)"],
          ["Lab Equipment", "500", "340", "=B2-C2"],
          ["Workbooks", "250", "210", "=B3-C3"],
          ["Field Trip", "800", "750", "=B4-C4"],
          ["Software Licenses", "300", "290", "=B5-C5"],
          ["Total", "=SUM(B2:B5)", "=SUM(C2:C5)", "=SUM(D2:D5)"],
        ],
      };
    } else {
      templateSheet = {
        name: "Physics Experiment",
        columns: ["A", "B", "C", "D"],
        rows: [
          ["Trial #", "Mass (kg)", "Acceleration (m/s²)", "Force (N = m*a)"],
          ["Trial 1", "2.5", "4.0", "=B2*C2"],
          ["Trial 2", "3.0", "3.5", "=B3*C3"],
          ["Trial 3", "1.8", "6.2", "=B4*C4"],
          ["Trial 4", "4.2", "2.1", "=B5*C5"],
          ["Mean Force", "-", "-", "=AVERAGE(D2:D5)"],
        ],
      };
    }

    onUpdate(card.id, {
      data: {
        ...card.data,
        sheets: [templateSheet],
        activeSheetIndex: 0,
      },
    });
    setShowFormulaGuide(false);
  };

  return (
    <CardWrapper
      card={card}
      viewport={viewport}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      icon={<Table className="w-4 h-4 text-emerald-400" />}
      headerColorClass="bg-[#107C41] border-b border-[#0d6133]"
      badgeText={sourceType === "embed" ? "Office Online" : "Excel Workbook"}
    >
      <div className="flex flex-col h-full bg-white text-neutral-800 select-none text-xs overflow-hidden">
        {/* Top Control Bar: Upload, Export, Formula Guide */}
        <div className="px-3 py-1.5 bg-[#f0fdf4] border-b border-emerald-200 flex items-center justify-between text-xs text-neutral-700">
          <div className="flex items-center gap-1.5">
            {/* Hidden File Input for .xlsx */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            {!readOnly && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-semibold text-[11px] flex items-center gap-1 shadow-sm transition-colors"
              title="Open genuine .xlsx, .xls, or .csv file from your computer"
            >
              <Upload className="w-3 h-3 text-emerald-600" />
              <span>Open .xlsx File</span>
            </button>
            )}

            <button
              onClick={handleExport}
              className="px-2 py-1 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 rounded text-[11px] font-medium flex items-center gap-1 shadow-sm transition-colors"
              title="Export current spreadsheet to real Excel .xlsx file"
            >
              <Download className="w-3 h-3 text-neutral-500" />
              <span>Export .xlsx</span>
            </button>

            <div className="h-4 w-px bg-emerald-300 mx-0.5" />

            <button
              onClick={() => setShowFormulaGuide(!showFormulaGuide)}
              className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                showFormulaGuide
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900"
              }`}
              title="Formula reference guide and practice templates"
            >
              <BookOpen className="w-3 h-3" />
              <span>Formulas & Lessons</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
            {statusMessage ? (
              <span className="text-emerald-700 font-medium bg-emerald-100 px-2 py-0.5 rounded text-[10px] animate-pulse">
                {statusMessage}
              </span>
            ) : (
              <span>{card.data.fileName}</span>
            )}
          </div>
        </div>

        {/* Formula Learning Drawer */}
        {showFormulaGuide && (
          <div className="bg-emerald-900 text-emerald-50 p-3 border-b border-emerald-800 text-xs animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Interactive Formula Learning Lab</span>
              </div>
              <button
                onClick={() => setShowFormulaGuide(false)}
                className="text-emerald-300 hover:text-white text-xs font-semibold px-1"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-[11px] text-emerald-200 mb-2.5">
              {readOnly
                ? <>Click any cell to see the formula behind it in the <span className="font-mono bg-emerald-950 px-1 py-0.5 rounded">fx</span> bar — the cells it uses light up in blue.</>
                : <>Type a formula in any cell or the <span className="font-mono bg-emerald-950 px-1 py-0.5 rounded">fx</span> bar. Results update instantly for the whole class.</>}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-2.5 text-[11px]">
              <div className="bg-emerald-950/60 p-2 rounded border border-emerald-800">
                <div className="font-bold text-emerald-300 font-mono">=SUM(A1:A5)</div>
                <div className="text-emerald-200 text-[10px]">Adds all numbers in the selected range.</div>
              </div>
              <div className="bg-emerald-950/60 p-2 rounded border border-emerald-800">
                <div className="font-bold text-emerald-300 font-mono">=AVERAGE(B2:B8)</div>
                <div className="text-emerald-200 text-[10px]">Calculates mathematical mean.</div>
              </div>
              <div className="bg-emerald-950/60 p-2 rounded border border-emerald-800">
                <div className="font-bold text-emerald-300 font-mono">=IF(D2&gt;=50, "Pass", "Fail")</div>
                <div className="text-emerald-200 text-[10px]">Logical condition test.</div>
              </div>
            </div>

            {!readOnly && (
            <div className="flex items-center gap-2 pt-2 border-t border-emerald-800/80">
              <span className="text-[11px] font-semibold text-emerald-300">Load Practice Lesson:</span>
              <button
                onClick={() => loadEducationalTemplate("grades")}
                className="px-2 py-0.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition-colors"
              >
                🎓 Student Gradebook
              </button>
              <button
                onClick={() => loadEducationalTemplate("budget")}
                className="px-2 py-0.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition-colors"
              >
                💰 Budget & Expenses
              </button>
              <button
                onClick={() => loadEducationalTemplate("science")}
                className="px-2 py-0.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition-colors"
              >
                🔬 Science & Physics
              </button>
            </div>
            )}
          </div>
        )}

        {/* Excel Formula Bar */}
        <div className="px-3 py-1.5 bg-[#f3f4f6] border-b border-neutral-300 flex items-center gap-2">
          <div className="w-14 text-center font-mono font-bold bg-white border border-neutral-300 rounded px-1.5 py-0.5 text-neutral-800 text-[11px] shadow-sm">
            {activeCellCoord}
          </div>
          <span className="font-serif italic font-bold text-neutral-400 text-sm">fx</span>
          <input
            id={`excel-fx-${card.id}`}
            type="text"
            value={editingValue !== "" ? editingValue : activeCellValue}
            readOnly={readOnly}
            onFocus={() => { if (!readOnly) setEditingValue(activeCellValue); }}
            onChange={(e) => {
              if (readOnly) return;
              setEditingValue(e.target.value);
              handleCellChange(selectedCell.r, selectedCell.c, e.target.value);
            }}
            onBlur={() => setEditingValue("")}
            className="flex-1 bg-white border border-neutral-300 rounded px-2.5 py-1 text-xs text-neutral-800 font-mono focus:outline-none focus:border-emerald-600 shadow-sm"
            placeholder={readOnly ? "Select a cell to see its formula" : "Type a formula, e.g. =SUM(B2:B5)*2, =VLOOKUP(A2, D2:E9, 2, FALSE), =IF(D2>=50, \"Pass\", \"Fail\")"}
          />

          {!readOnly && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleAddRow}
              className="p-1 px-2 bg-neutral-200 hover:bg-neutral-300 rounded text-[11px] font-semibold text-neutral-700 flex items-center gap-0.5 transition-colors"
              title="Add row"
            >
              <Plus className="w-3 h-3" /> Row
            </button>
            <button
              onClick={handleAddCol}
              className="p-1 px-2 bg-neutral-200 hover:bg-neutral-300 rounded text-[11px] font-semibold text-neutral-700 flex items-center gap-0.5 transition-colors"
              title="Add column"
            >
              <Plus className="w-3 h-3" /> Col
            </button>
          </div>
          )}
        </div>

        {/* Spreadsheet Grid Table */}
        <div className="flex-1 overflow-auto bg-neutral-50 relative">
          <table className="w-full border-collapse text-left font-sans text-xs">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-500 font-semibold sticky top-0 z-10">
                <th className="w-10 p-1.5 text-center bg-neutral-200/90 border-r border-neutral-300 font-mono text-[10px]">
                  #
                </th>
                {currentSheet.columns.map((col, cIdx) => (
                  <th
                    key={cIdx}
                    className="p-1.5 px-3 min-w-[95px] border-r border-neutral-300 text-center font-mono text-[11px]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentSheet.rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-neutral-200 hover:bg-neutral-100/40">
                  <td className="p-1 text-center bg-neutral-100 border-r border-neutral-300 font-mono text-[10px] text-neutral-500 select-none">
                    {rIdx + 1}
                  </td>
                  {currentSheet.columns.map((_, cIdx) => {
                    const rawVal = row[cIdx] ?? "";
                    const isSelectedCell = selectedCell.r === rIdx && selectedCell.c === cIdx;
                    const isReferencedInFormula = refCellSet.has(`${rIdx},${cIdx}`);
                    const displayVal = evaluateFormula(rawVal, currentSheet.rows);

                    return (
                      <td
                        key={cIdx}
                        onClick={() => setSelectedCell({ r: rIdx, c: cIdx })}
                        className={`p-1 px-2 border-r border-neutral-200 font-mono text-xs cursor-text transition-all relative ${
                          isSelectedCell
                            ? "bg-emerald-50 ring-2 ring-emerald-600 ring-inset z-[2]"
                            : isReferencedInFormula
                            ? "bg-blue-50 ring-2 ring-blue-500 ring-dashed ring-inset"
                            : ""
                        } ${rIdx === 0 ? "font-semibold bg-neutral-50/80" : ""}`}
                      >
                        {isSelectedCell && !readOnly ? (
                          <input
                            type="text"
                            autoFocus
                            value={rawVal}
                            onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                            className="w-full bg-transparent focus:outline-none text-neutral-900 font-mono"
                          />
                        ) : (
                          <span
                            className={`block truncate ${
                              rawVal.startsWith("=") ? "font-semibold text-emerald-800" : "text-neutral-800"
                            }`}
                            title={rawVal}
                          >
                            {displayVal}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Excel Sheets Tab Bar */}
        <div className="px-2 py-1 bg-[#f3f4f6] border-t border-neutral-300 flex items-center justify-between text-[11px] text-neutral-600">
          <div className="flex items-center gap-1 overflow-x-auto">
            {sheets.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (readOnly) {
                    setLocalSheetIndex(idx);
                    return;
                  }
                  onUpdate(card.id, {
                    data: {
                      ...card.data,
                      activeSheetIndex: idx,
                    },
                  });
                }}
                className={`px-3 py-1 rounded-t border-t border-x font-medium transition-all ${
                  idx === activeSheetIndex
                    ? "bg-white text-emerald-800 border-neutral-300 shadow-sm font-semibold border-b-2 border-b-white -mb-px"
                    : "hover:bg-neutral-200 border-transparent text-neutral-500"
                }`}
              >
                {s.name || `Sheet ${idx + 1}`}
              </button>
            ))}
          </div>

          <div className="text-[10px] text-neutral-400 font-mono shrink-0">
            {currentSheet.rows.length} rows × {currentSheet.columns.length} cols
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
