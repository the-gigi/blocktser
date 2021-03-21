import Phaser from 'phaser'
import Shape from "~/game/Shape";
import Rectangle = Phaser.Geom.Rectangle;
import BaseGrid from "~/game/BaseGrid";

export type Pair = [number, number]

export default class StagingArea extends BaseGrid {
    private readonly _shapes!: Shape[]
    private readonly _parts!: Rectangle[]
    private readonly _nullShape!: Shape
    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                rows: number,
                cols: number,
                unit: number,
                fillColor: number) {
        super(scene, x, y, rows, cols, unit, fillColor)
        this._nullShape = new Shape(scene, 0, 0, 0, [])
        this._shapes = [this._nullShape, this._nullShape, this._nullShape]
        this._parts = []

        const width = 7 * unit
        const height = rows * unit
        for (let i = 0; i < 3; ++i) {
            const rect = new Rectangle(
                x + i * 6 * unit,
                y,
                width,
                height)

            this._parts.push(rect)
        }
    }

    get shapes(): (Shape)[] {
        return this._shapes.filter((shape) => shape !== this._nullShape)
    }

    addShape(shape: (Shape)) {
        for (let i = 0; i < this._shapes.length; ++i) {
            const currShape = this._shapes[i]
            if (currShape == this._nullShape) {
                this._shapes[i] = shape
                shape.centerInRect(this._parts[i])
                return
            }
        }
    }

    repositionShape(shape: (Shape)) {
        for (let i = 0; i < this._shapes.length; ++i) {
            const currShape = this._shapes[i]
            if (currShape == shape) {
                shape.centerInRect(this._parts[i])
                return
            }
        }
    }

    onDragStart(shape: Shape) {

    }

    destroyShape(shape: Shape) {
        for (let i = 0; i < this._shapes.length; ++i) {
            if (this._shapes[i] != shape) {
                continue
            }

            shape.destroy()
            this._shapes[i] = this._nullShape
            return
        }
    }

    onDragEnd(shape: Shape) {
    }

    onDragging(shape: Shape) {
    }

    get empty(): boolean {
        return this._shapes.reduce((acc, shape) => acc && shape === this._nullShape, true)
    }

    set interactive(value: boolean) {
       this._shapes.forEach(s => s.interactive = value)
    }
}