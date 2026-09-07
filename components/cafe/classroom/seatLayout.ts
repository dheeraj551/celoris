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

    const hostSize = Math.min(width * 0.22, height * 0.42, 140)
    const host: SeatRect = {
        x: width / 2,
        y: hostSize / 2 + 16,
        size: hostSize,
    }

    const gridTop = hostSize + 48
    const gridHeight = Math.max(height - gridTop - 16, 60)

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
    const seatSize = Math.max(Math.min(cellW, cellH) * 0.72, 40)

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
