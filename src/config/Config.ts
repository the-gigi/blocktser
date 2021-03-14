export type ComponentConfig = {
    unit: number,
    x: number,
    y: number,
    rows: number,
    cols: number,
    fillColor: number,
}

export type Config = {
    dragScale: number,
    grid: ComponentConfig,
    stagingArea: ComponentConfig
}

export default function GetConfig(screenWidth, screenHeight) : Config {
    const gridCols = 10
    const gridRows = 10
    const topBarRows = 3
    const stagingAreaRows = 7  // space + 5 + space
    const stagingAreaCols = 19 // space + 5 + space + 5 + space + 5 + space
    const totalRows = gridRows + topBarRows + stagingAreaRows
    const unit = Math.min(screenHeight / (totalRows + 2), screenWidth / (gridCols + 2))

    const grid = {
        unit: unit,
        x: screenWidth / 2 - gridCols * unit / 2,
        y: screenHeight / 2 - gridRows * unit / 2,
        rows: gridRows,
        cols: gridCols,
        fillColor: 0x88ff66,
    }

    const stagingArea = {
        unit: grid.unit * gridRows / stagingAreaCols,
        x: grid.x,
        y: grid.y + grid.rows * unit,
        rows: stagingAreaRows,
        cols: stagingAreaCols,
        fillColor: 0x99aa55,
    }

    return {
        dragScale: grid.unit / stagingArea.unit,
        grid: grid,
        stagingArea: stagingArea
    }
}
