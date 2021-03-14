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
        const col = (r.centerX - this.x) / this.unit
        const row = (r.centerY - this.y) / this.unit
        return [row, col]
    }

    isOnGrid(row: number, col: number): boolean {
        return row >= 0 && col >= 0 && row < this.rows && col < this.cols
    }

    onDragStart(shape: Shape) {
    }

    onDragEnd(shape: Shape) {
    }

    onDragging(shape: Shape) {
        console.log('MainArea.onDragging()')
        const [row, col] = this.findGridLocation(shape)
        if (!this.isOnGrid(row, col)) {
            return
        }

        this.updatePhantom(row, col, shape)
    }

    createPhantom(x: number, y: number, shape: Shape) {
        this.phantom = new Shape(this.scene, x, y, this.unit, shape.cells,
                                 TextureKeys.Phantom)
    }

    updatePhantom(row: number, col: number, shape: Shape) {
        const x = this.x + col * this.unit
        const y = this.y + row * this.unit
        if (this.phantom == null) {
            this.createPhantom(row, col, shape)
            return
        }

        this.phantom.setPosition(x, y)
        this.phantom.updateShape()
    }

}