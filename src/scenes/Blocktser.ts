import Phaser from 'phaser'
import GetConfig from "~/config/Config";
import Shape from "~/game/Shape";
import TextureKeys from "~/config/TextureKeys";
import Pair from "~/game/Shape";
import StagingArea from "~/game/StagingArea";


export default class Blockster extends Phaser.Scene {
    private grid!: Phaser.GameObjects.Grid
    private topBar!: Phaser.GameObjects.Grid
    private stagingArea!: StagingArea
    private shape!: Shape

    constructor() {
        super('blockster')
    }

    preload() {
    }

    create() {
        const w = this.physics.world.bounds.width
        const h = this.physics.world.bounds.height
        const config = GetConfig(w, h)
        this.grid = this.createGrid(config.grid)
        //this.stagingArea = this.createGrid(config.stagingArea)
        this.stagingArea = this.createStagingArea(config.stagingArea)
        const pos = this.grid.getTopLeft()
        this.shape = this.createShape(pos.x, pos.y, config.grid.unit)

    }

    createStagingArea(config) {
        const c = config
        return new StagingArea(this, c.x, c.y, c.rows, c.cols, c.unit, c.fillColor)
    }

    createGrid(gridConfig) {
        const g = gridConfig
        const u = gridConfig.unit
        const w = u * g.cols
        const h = u * g.rows
        const x = g.x + w /2
        const y = g.y + h / 2

        return this.add.grid(x, y, w, h, u, u, g.fillColor)
    }

    createShape(x, y, unit: number) {
        let cells: Pair[] = [[0,0], [1,0], [1,1], [1,2], [1,3]]
        return new Shape(this, x, y, unit, cells, TextureKeys.Blue)
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }
}
