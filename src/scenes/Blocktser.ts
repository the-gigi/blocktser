import Phaser from 'phaser'
import GetConfig, {ComponentConfig, Config} from "~/config/Config";
import Shape from "~/game/Shape";
import Pair from "~/game/Shape";
import TextureKeys from "~/config/TextureKeys";
import StagingArea from "~/game/StagingArea";
import MainArea from "~/game/MainArea";
import ShapeEventHandler from "~/game/Interfaces";


export default class Blockster extends Phaser.Scene
    implements ShapeEventHandler {
    private mainArea!: MainArea
    private topBar!: Phaser.GameObjects.Grid
    private stagingArea!: StagingArea
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
        this.createMainArea(this.config.mainArea)
        this.createStagingArea(this.config.stagingArea)
    }

    createStagingArea(stagingAreaConfig: ComponentConfig) {
        const c = stagingAreaConfig
        this.stagingArea = new StagingArea(this, c.x, c.y, c.rows, c.cols, c.unit, c.fillColor)
        this.populateStagingArea(c.unit)
    }

    populateStagingArea(unit: number) {
        // add some shapes to staging area
        for (let i = 0; i < 3; ++i) {
            let shape = this.createShape(0, 0, unit, 1, true)
            this.stagingArea.addShape(shape)
        }
    }

    createMainArea(mainAreaConfig: ComponentConfig) {
        const g = mainAreaConfig
        const handler: ShapeEventHandler = this
        this.mainArea = new MainArea(this, g.x, g.y, g.rows, g.cols, g.unit, g.fillColor, handler)
    }

    createShape(x, y, unit: number, depth: number = 0, draggable: boolean = false) {
        const shapes: Pair[][] = [
            [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3]],
            [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
            [[0, 0]],
            [[0, 0], [0, 1], [0, 2]],
            [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
        ]

        // Need to fix and add half a unit
        x += unit / 2
        y += unit / 2
        let cells = shapes[Math.floor(Math.random() * (shapes.length))]
        const texture = Math.random() < 0.5 ? TextureKeys.Blue : TextureKeys.Red
        console.log(`createShape(), this.config.imageDragScale: ${this.config.imageDragScale}`)
        const dragHandlers = [this.mainArea, this.stagingArea]
        const dragScale = this.config.dragScale
        const imageDragScale = this.config.imageDragScale
        return new Shape(this, x, y, unit, cells, texture, depth, dragScale, imageDragScale, draggable, dragHandlers)
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }


    onDrop(shape: Shape, ok: boolean) {
        if (ok) {
            this.stagingArea.destroyShape(shape)
            if (this.stagingArea.empty) {
                this.populateStagingArea(this.config.stagingArea.unit)
            }
        } else {
            this.stagingArea.repositionShape(shape)
        }
    }
}
