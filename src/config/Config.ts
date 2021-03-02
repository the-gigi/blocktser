

export default function GetConfig(screenWidth, screenHeight) {

    const cols = 10
    const gridRows = 10
    const topBarRows = 3
    const stagingAreaRows = 5
    const totalRows = gridRows + topBarRows + stagingAreaRows
    const unit = Math.min(screenHeight / (totalRows + 2), screenWidth / (cols + 2))

    return {
        unit: unit,
        grid: {
            x: screenWidth / 2 - cols * unit / 2,
            y: screenHeight / 2 - gridRows * unit / 2,
            rows: 10,
            cols: 10,
            fillColor: 0x88ff66,
        }
    }
}
