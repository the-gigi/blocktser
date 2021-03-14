import Phaser from 'phaser'
import GetConfig, {ComponentConfig, Config} from "~/config/Config";
import Shape from "~/game/Shape";
import Pair from "~/game/Shape";
import TextureKeys from "~/config/TextureKeys";
import StagingArea from "~/game/StagingArea";
import MainArea from "~/game/MainArea";


export default class Blockster extends Phaser.Scene {
    private mainArea!: MainArea
    private topBar!: Phaser.GameObjects.Grid
    private stagingArea!: StagingArea
    private shape!: Shape
    private config!: Config

    constructor() {
        super('blocktser')
    }

    preload() {
    }

    create() {
        const w = this.physics.world.bounds.width
        const h = this.physics.world.bounds.height
        this.config = GetConfig(w, h)
        this.mainArea = this.createMainArea(this.config.mainArea)
        this.stagingArea = this.createStagingArea(this.config.stagingArea)

        // // Add a shape to play with
        //const pos = this.grid.getTopLeft()
        //this.shape = this.createShape(pos.x, pos.y, config.grid.unit, true)
    }

    createStagingArea(stagingAreaConfig: ComponentConfig) {
        const c = stagingAreaConfig
        const stagingArea = new StagingArea(this, c.x, c.y, c.rows, c.cols, c.unit, c.fillColor)

        // add some shapes to staging area
        for (let i = 0; i < 3; ++i) {
            let shape = this.createShape(0, 0, c.unit, true)
            stagingArea.setShape(i, shape)
        }

        return stagingArea
    }

    createMainArea(mainAreaConfig: ComponentConfig) : MainArea {
        const g = mainAreaConfig
        return new MainArea(this, g.x, g.y, g.rows, g.cols, g.unit, g.fillColor)
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
        const texture = Math.random() < 0.5 ? TextureKeys.Blue : TextureKeys.Red
        return new Shape(this, x, y, unit, cells, texture, this.config.dragScale, draggable, this.mainArea)
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }
}
