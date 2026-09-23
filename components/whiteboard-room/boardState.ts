import type { CanvasCard, PaperTextureType, Stroke } from "./types";

/**
 * The shared board is an append-only list of operations (stored in
 * `cafe_room_events`). Everyone rebuilds the same board by replaying them in
 * order, and applies new ones as they stream in over Supabase Realtime.
 */
export interface BoardState {
  strokes: Stroke[];
  cards: CanvasCard[];
  texture: PaperTextureType;
}

export type BoardOp =
  | { type: "stroke_add"; stroke: Stroke }
  | { type: "strokes_delete"; ids: string[] }
  | { type: "strokes_restore"; strokes: Stroke[] }
  | { type: "board_clear" }
  | { type: "card_create"; card: CanvasCard }
  | { type: "card_update"; cardId: string; updates: Partial<CanvasCard> }
  | { type: "card_delete"; cardId: string }
  | { type: "background"; texture: PaperTextureType };

export const EMPTY_BOARD: BoardState = { strokes: [], cards: [], texture: "paper-plain" };

export function applyBoardOp(state: BoardState, op: BoardOp): BoardState {
  switch (op.type) {
    case "stroke_add": {
      const idx = state.strokes.findIndex((s) => s.id === op.stroke.id);
      if (idx >= 0) {
        const strokes = state.strokes.slice();
        strokes[idx] = op.stroke;
        return { ...state, strokes };
      }
      return { ...state, strokes: [...state.strokes, op.stroke] };
    }
    case "strokes_delete": {
      const ids = new Set(op.ids);
      return { ...state, strokes: state.strokes.filter((s) => !ids.has(s.id)) };
    }
    case "strokes_restore": {
      const existing = new Set(state.strokes.map((s) => s.id));
      const restored = op.strokes.filter((s) => !existing.has(s.id));
      if (!restored.length) return state;
      // Keep chronological order so layering (highlighter under ink) holds.
      return { ...state, strokes: [...state.strokes, ...restored].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)) };
    }
    case "board_clear":
      return { ...state, strokes: [] };
    case "card_create":
      if (state.cards.some((c) => c.id === op.card.id)) return state;
      return { ...state, cards: [...state.cards, op.card] };
    case "card_update":
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === op.cardId
            ? ({
                ...c,
                ...op.updates,
                // The card's type and id never change through an update.
                id: c.id,
                type: c.type,
                data: op.updates.data ? { ...(c as any).data, ...(op.updates as any).data } : (c as any).data,
              } as CanvasCard)
            : c
        ),
      };
    case "card_delete":
      return { ...state, cards: state.cards.filter((c) => c.id !== op.cardId) };
    case "background":
      return { ...state, texture: op.texture };
  }
  return state;
}

export function replayBoard(ops: BoardOp[]): BoardState {
  return ops.reduce(applyBoardOp, EMPTY_BOARD);
}

/** Smaller payloads: drop per-point timestamps and round coordinates. */
export function compactStroke(stroke: Stroke): Stroke {
  return {
    id: stroke.id,
    tool: stroke.tool,
    color: stroke.color,
    size: Math.round(stroke.size * 100) / 100,
    points: stroke.points.map((p) => ({
      x: Math.round(p.x * 100) / 100,
      y: Math.round(p.y * 100) / 100,
      pressure: Math.round(p.pressure * 1000) / 1000,
    })),
    bleedIntensity: stroke.bleedIntensity,
    createdAt: stroke.createdAt,
  };
}
