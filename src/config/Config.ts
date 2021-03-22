export interface ComponentConfig {
    unit: number
    x: number
    y: number
    rows: number
    cols: number
    fillColor: number
}

export interface TextConfig {
    fontSize: string
    color: string
    backgroundColor: string
    shadow: object
    padding: object
}

export interface TopBarConfig extends ComponentConfig, TextConfig {}

export interface Config {
    dragScale: number
    imageDragScale: number
    mainArea: ComponentConfig
    topBar: TopBarConfig
    stagingArea: ComponentConfig
    gameOver: TextConfig
    playMusic: boolean
}

export default function GetConfig(screenWidth, screenHeight): Config {
    const gridCols = 10
    const gridRows = 10
    const topBarRows = 3
    const stagingAreaRows = 7  // space + 5 + space
    const stagingAreaCols = 19 // space + 5 + space + 5 + space + 5 + space
    const totalRows = gridRows + topBarRows + stagingAreaRows
    const unit = Math.min(screenHeight / (totalRows + 2), screenWidth / (gridCols + 2))

    const grid : ComponentConfig = {
        unit: unit
        x: screenWidth / 2 - gridCols / 2 * unit
        y: screenHeight / 2 - gridRows / 2 * unit
        rows: gridRows
        cols: gridCols
        fillColor: 0x88ff66
    }

    const topBar : TopBarConfig = {
        unit: unit
        x: grid.x
        y: grid.y - topBarRows * unit
        rows: topBarRows
        cols: gridCols
        fillColor: 0xffc6ac
        fontSize: '18px'
        color: '#000000'
        backgroundColor: '#ffc6ac'
        shadow: {fill: true, blur: 0, offsetY: 0}
        padding: {left: 5, right: 5, top: 0, bottom: 0}
    }

    const stagingArea : ComponentConfig = {
        unit: grid.unit * gridRows / stagingAreaCols
        x: grid.x
        y: grid.y + grid.rows * unit
        rows: stagingAreaRows
        cols: stagingAreaCols
        fillColor: 0x99aa55
    }

    const gameOver : TextConfig = {
        fontSize: '20px'
        color: '#ffffff'
        backgroundColor: '#00ff00'
        shadow: {fill: true, blur: 0, offsetY: 0}
        padding: {left: 10, right: 10, top: 0, bottom: 0}
    }

    return {
        dragScale: grid.unit / stagingArea.unit
        imageDragScale: 0.85
        mainArea: grid
        topBar: topBar
        stagingArea: stagingArea
        gameOver: gameOver
        playMusic: false
    }
}
