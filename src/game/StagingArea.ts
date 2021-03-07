import Phaser from 'phaser'
import Shape from "~/game/Shape";
import Rectangle = Phaser.Geom.Rectangle;


export type Pair = [number, number]

export default class StagingArea extends Phaser.GameObjects.Container {
    private readonly shapes!: (Shape | null)[]
    private parts!: Rectangle[]
    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                rows: number,
                cols: number,
                unit: number,
                fillColor: number) {
        super(scene, x, y)

        this.shapes = [null, null, null]
        this.parts = []

        const width = cols * unit
        const height = rows * unit
        for (let i = 0; i < 3; ++i) {
            const rect = new Rectangle(
                x + i * width / 3,
                y,
                width / 3,
                height)

            this.parts.push(rect)
        }

        this.createGrid(unit, rows, cols, fillColor)
    }

    createGrid(unit: number, rows: number, cols: number, fillColor: number) {
        const u = unit
        const w = u * cols
        const h = u * rows
        const x = this.x + w /2
        const y = this.y + h / 2

        return this.scene.add.grid(x, y, w, h, u, u, fillColor)
    }
    setShape(index: number, shape: (Shape | null)) {
        const currShape = this.shapes[index]
        if (currShape !== null) {
            currShape.destroy()
            this.shapes[index] = null
        }

        this.shapes[index] = shape
        if (shape !== null) {
            this.centerInRect(shape, this.parts[index])
        }
    }

    centerInRect(shape: Shape, rect: Rectangle) {
        shape.x = rect.x + (rect.width - shape.width) / 2
        shape.y = rect.y + (rect.height - shape.height) / 2
    }

    preUpdate() {
    }
}