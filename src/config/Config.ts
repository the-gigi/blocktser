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

    const mainArea : ComponentConfig = {
        unit: unit
        x: screenWidth / 2 - gridCols / 2 * unit
        y: screenHeight / 2 - gridRows / 2 * unit
        rows: gridRows
        cols: gridCols
        fillColor: 0x88ff66

        fontSize: '60px'
        fontColor: '#ffffff'
        backgroundColor: '#ff00dd'
        shadow: {fill: true, blur: 0, offsetY: 0}
        padding: {left: 0, right: 0, top: 0, bottom: 0}

        scoreBumpDelay: 60
    }

    const topBar : TopBarConfig = {
        unit: unit
        x: mainArea.x
        y: mainArea.y - topBarRows * unit
        offset: 10
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
        unit: mainArea.unit * gridRows / stagingAreaCols
        x: mainArea.x
        y: mainArea.y + mainArea.rows * unit
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
        dragScale: mainArea.unit / stagingArea.unit
        imageDragScale: 0.85
        mainArea: mainArea
        topBar: topBar
        stagingArea: stagingArea
        gameOver: gameOver
        playMusic: false
    }
}
