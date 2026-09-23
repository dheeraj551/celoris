"use client";

import { createContext, useContext } from "react";

/**
 * Whether the local viewer may change the board. Students get a read-only
 * board (they can pan/zoom their own view, and move their own copy of the
 * live screen-share window, but nothing they do is sent to the room — the
 * server rejects board changes from non-trainers anyway).
 */
export const BoardReadOnlyContext = createContext<boolean>(false);

export function useBoardReadOnly() {
  return useContext(BoardReadOnlyContext);
}
