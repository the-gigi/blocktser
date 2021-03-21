

export interface ComponentConfig {
    unit: number,
    x: number,
    y: number,
    rows: number,
    cols: number,
    fillColor: number,
}

export interface GameOverConfig {
    fontSize: string
    color: string
    backgroundColor: string
    shadow: object
    padding: object
}

export interface Config {
    dragScale: number,
    imageDragScale: number,
    mainArea: ComponentConfig,
    stagingArea: ComponentConfig
    gameOver: GameOverConfig
}

export default function GetConfig(screenWidth, screenHeight): Config {
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

    const gameOver : GameOverConfig = {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#00ff00',
        shadow: {fill: true, blur: 0, offsetY: 0},
        padding: {left: 10, right: 10, top: 0, bottom: 0}
    }

    return {
        dragScale: grid.unit / stagingArea.unit,
        imageDragScale: 0.85,
        mainArea: grid,
        stagingArea: stagingArea,
        gameOver: gameOver
    }
}
