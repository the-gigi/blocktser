import Phaser from 'phaser'
import GetConfig from "~/config/Config";


export default class Blockster extends Phaser.Scene {
    private grid!: Phaser.GameObjects.Grid

    constructor() {
        super('blockster')
    }

    preload() {
    }

    create() {
        const w = this.physics.world.bounds.width
        const h = this.physics.world.bounds.height
        const config = GetConfig(w, h)
        this.createGrid(config.grid, config.unit)
    }

    createGrid(gridConfig, unit) {
        const g = gridConfig
        const u = unit
        const w = u * g.rows
        const h = u * g.cols
        const x = g.x + w /2
        const y = g.y + h / 2

        this.grid = this.add.grid(x, y, w, h, u, u, g.fillColor)
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }
}
