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
        super('blocktser')
    }

    preload() {
    }

    create() {
        const w = this.physics.world.bounds.width
        const h = this.physics.world.bounds.height
        const config = GetConfig(w, h)
        this.grid = this.createGrid(config.grid)
        this.stagingArea = this.createStagingArea(config.stagingArea)
        const pos = this.grid.getTopLeft()

        // Add a shape to play with
        //this.shape = this.createShape(pos.x, pos.y, config.grid.unit, true)
    }

    createStagingArea(config) {
        const c = config
        const stagingArea = new StagingArea(this, c.x, c.y, c.rows, c.cols, c.unit, c.fillColor)

        // add some shapes to staging area
        for (let i = 0; i < 3; ++i) {
            let shape = this.createShape(0, 0, c.unit, true)
            stagingArea.setShape(i, shape)
        }

        return stagingArea
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

    createShape(x, y, unit: number, draggable: boolean = false) {
        const shapes: Pair[][] = [
            [[0,0], [1,0], [1,1], [1,2], [1,3]],
            [[0,0], [0,1], [0,2], [1,0], [1,1], [1,2], [2,0], [2,1], [2,2]],
            [[0,0]],
            [[0,0], [0,1], [0,2]],
            [[0,0], [0,1], [0,2], [1,2], [2,2]],
            [[0,0], [0,1], [1,0], [1,1]],
            [[0,0], [0,1], [0, 2], [0,3], [0,4]]
        ]

        // Need to fix and add half a unit
        x += unit / 2
        y += unit / 2
        let cells = shapes[Math.floor(Math.random() * (shapes.length))]
        return new Shape(this, x, y, unit, cells, TextureKeys.Blue, draggable)
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }
}
