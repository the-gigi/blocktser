import Phaser from 'phaser'
import Shape, {Pair} from "~/game/Shape";
import BaseGrid from "~/game/BaseGrid";
import TextureKeys from "~/config/TextureKeys";
import ShapeDragHandler from "~/game/Interfaces";

export default class MainArea extends    BaseGrid
                              implements ShapeDragHandler {
    private phantom!: (Shape | null)

    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                rows: number,
                cols: number,
                unit: number,
                fillColor: number) {
        super(scene, x, y, rows, cols, unit, fillColor)
        this.phantom = null
    }

    preUpdate() {

    }

    findGridLocation(shape: Shape): Pair {
        const r = shape.images[0].getBounds()
        const col = Math.round((r.centerX - this.x) / this.unit) - 1
        const row = Math.round((r.centerY - this.y) / this.unit) - 1
        return [row, col]
    }

    isOnGrid(shape: Shape): boolean {
        const [row, col] = this.findGridLocation(shape)
        return row >= 0 && col >= 0 && row <= this.rows - shape.height && col <= this.cols - shape.width
    }

    createPhantom(x: number, y: number, shape: Shape) {
        this.phantom = new Shape(this.scene, x, y, this.unit, shape.cells, TextureKeys.Phantom)
    }

    updatePhantom(shape: Shape) {
        const [row, col] = this.findGridLocation(shape)
        const x = this.x + (col + 0.5) * this.unit
        const y = this.y + (row + 0.5) * this.unit
        if (this.phantom == null) {
            this.createPhantom(x, y, shape)
            return
        }

        this.phantom.setPosition(x, y)
        this.phantom.updateShape()
    }

    onDragStart(shape: Shape) {
    }

    onDragEnd(shape: Shape) {
        this.clearPhantom()
    }

    clearPhantom() {
        if (this.phantom == null) {
            return
        }

        this.phantom.images.forEach((image) => image.destroy())
        this.phantom = null
    }

    onDragging(shape: Shape) {
        if (!this.isOnGrid(shape)) {
            this.clearPhantom()
            return
        }

        this.updatePhantom(shape)
    }
}