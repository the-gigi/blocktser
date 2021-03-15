import Phaser from 'phaser'
import Shape from "~/game/Shape";
import Rectangle = Phaser.Geom.Rectangle;
import BaseGrid from "~/game/MainArea";
import ShapeDragHandler from "~/game/Interfaces";


export type Pair = [number, number]

export default class StagingArea extends BaseGrid {
    private readonly shapes!: (Shape | null)[]
    private readonly parts!: Rectangle[]
    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                rows: number,
                cols: number,
                unit: number,
                fillColor: number) {
        super(scene, x, y, rows, cols, unit, fillColor)

        this.shapes = [null, null, null]
        this.parts = []

        const width = 7 * unit
        const height = rows * unit
        for (let i = 0; i < 3; ++i) {
            const rect = new Rectangle(
                x + i * 6 * unit,
                y,
                width,
                height)

            this.parts.push(rect)
        }
    }

    addShape(shape: (Shape)) {
        for (let i = 0; i < this.shapes.length; ++i) {
            const currShape = this.shapes[i]
            if (currShape == null) {
                this.shapes[i] = shape
                shape.centerInRect(this.parts[i])
                return
            }
        }
    }

    repositionShape(shape: (Shape)) {
        for (let i = 0; i < this.shapes.length; ++i) {
            const currShape = this.shapes[i]
            if (currShape == shape) {
                shape.centerInRect(this.parts[i])
                return
            }
        }
    }

    onDragStart(shape: Shape) {

    }

    destroyShape(shape: Shape) {
        for (let i = 0; i < this.shapes.length; ++i) {
            if (this.shapes[i] != shape) {
                continue
            }

            shape.destroy()
            this.shapes[i] = null
            return
        }
    }

    onDragEnd(shape: Shape) {
    }

    onDragging(shape: Shape) {
    }


    preUpdate() {
    }
}