export default function GetConfig(screenWidth, screenHeight) {

    const cols = 10
    const gridRows = 10
    const topBarRows = 3
    const stagingAreaRows = 10
    const totalRows = gridRows + topBarRows + stagingAreaRows
    const unit = Math.min(screenHeight / (totalRows + 2), screenWidth / (cols + 2))

    const grid = {
        unit: unit,
        x: screenWidth / 2 - cols * unit / 2,
        y: screenHeight / 2 - gridRows * unit / 2,
        rows: gridRows,
        cols: cols,
        fillColor: 0x88ff66,
    }
    const stagingArea = {
        unit: unit / 2,
        x: grid.x,
        y: grid.y + grid.rows * unit,
        rows: stagingAreaRows,
        cols: cols * 2,
        fillColor: 0x99aa55,
    }

    return {
        grid: grid,
        stagingArea: stagingArea
    }
}
