// Pure layout math shared by the PixiJS seat/avatar layer (RoomStage) and
// the real <video> tiles that get positioned on top of it. Keeping this in
// one place means the canvas decoration and the live video are always
// aligned, however many people are in the room or however the window is
// resized — nobody has to keep two coordinate systems in sync by hand.

export interface SeatRect {
    x: number
    y: number
    size: number
}

// Host gets a slightly larger, centered "stage" seat up top; everyone else
// is arranged in a simple wrapping row grid below it. This isn't a
// free-roam space (unlike the general Cafe rooms) — it's a seated
// classroom, so a stable grid reads better than scattered placement and
// is far cheaper to keep in sync on resize.
export function computeSeatLayout(
    containerWidth: number,
    containerHeight: number,
    studentCount: number
): { host: SeatRect; students: SeatRect[] } {
    const width = Math.max(containerWidth, 1)
    const height = Math.max(containerHeight, 1)

    const hostSize = Math.min(width * 0.22, height * 0.42, 116)
    const host: SeatRect = {
        x: width / 2,
        y: hostSize / 2 + 16,
        size: hostSize,
    }

    // Every seat's name label is drawn *below* its circle (see RoomStage's
    // nameLabel), so each row needs headroom for that label, not just the
    // circle itself — otherwise a row's label bleeds into the row below it,
    // and for the LAST row specifically, past the container's bottom edge,
    // where the parent's overflow-hidden silently clips it. That's what was
    // causing "some student names are visible, some aren't."
    const LABEL_ALLOWANCE = 22
    const gridTop = hostSize + 48
    const gridHeight = Math.max(height - gridTop - (16 + LABEL_ALLOWANCE), 60)

    if (studentCount === 0) {
        return { host, students: [] }
    }

    // Pick a column count that keeps seats roughly square and never
    // overflows the available width, then derive rows from that.
    const maxCols = Math.max(1, Math.min(studentCount, Math.floor(width / 90)))
    const cols = Math.min(studentCount, Math.max(3, maxCols))
    const rows = Math.ceil(studentCount / cols)

    const cellW = width / cols
    const cellH = Math.min(gridHeight / rows, cellW)
    // Capped at 96 so a nearly-empty room doesn't balloon a lone student
    // into a giant circle just because there's empty space to fill — seats
    // should look like seats at any headcount, not stretch to fit the room.
    // Also shrunk by LABEL_ALLOWANCE so the name label always has room
    // inside the seat's own row band instead of overlapping the next one.
    const seatSize = Math.min(Math.max(Math.min(cellW, cellH - LABEL_ALLOWANCE) * 0.72, 40), 96)

    const students: SeatRect[] = []
    for (let i = 0; i < studentCount; i++) {
        const row = Math.floor(i / cols)
        const col = i % cols
        // Center the last (possibly partial) row instead of left-aligning it.
        const itemsInRow = row === rows - 1 ? studentCount - row * cols : cols
        const rowOffset = (cols - itemsInRow) * cellW / 2

        students.push({
            x: rowOffset + col * cellW + cellW / 2,
            y: gridTop + row * cellH + cellH / 2,
            size: seatSize,
        })
    }

    return { host, students }
}
