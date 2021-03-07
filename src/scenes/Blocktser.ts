import Phaser from 'phaser'
import GetConfig from "~/config/Config";


export default class Blockster extends Phaser.Scene {
    private grid!: Phaser.GameObjects.Grid
    private topBar!: Phaser.GameObjects.Grid
    private stagingArea!: Phaser.GameObjects.Grid

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
        this.stagingArea = this.createGrid(config.stagingArea)
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

    update(time: number, delta: number) {
        super.update(time, delta);
    }
}
