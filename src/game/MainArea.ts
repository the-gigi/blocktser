import Phaser from 'phaser'
import Shape, {Pair} from "~/game/Shape";
import BaseGrid from "~/game/BaseGrid";
import TextureKeys from "~/config/TextureKeys";
import ShapeDragHandler from "~/game/Interfaces";

export default class MainArea extends    BaseGrid
                              implements ShapeDragHandler {
    private phantom!: (Shape | null)
    private cells!: Map<Pair, Phaser.GameObjects.Image>

    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                rows: number,
                cols: number,
                unit: number,
                fillColor: number) {
        super(scene, x, y, rows, cols, unit, fillColor)
        this.phantom = null
        this.cells = new Map<Pair, Phaser.GameObjects.Image>()
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

    settleShape(shape: Shape) {
        // bail out if shape intersects with any occupied cell
        const [row, col] = this.findGridLocation(shape)
        shape.cells.forEach((cell) => {
            const key: Pair = [row + cell[1], col + cell[0]]
            if (this.cells.has(key)) {
                return
            }
        })

        // Populate cells with the shape's image
        shape.cells.forEach((cell) => {
            const x = this.x + (col + cell[0] + 0.5) * this.unit
            const y = this.y + (row + cell[1] + 0.5) * this.unit
            const image = this.scene.add.image(x, y, shape.texture)
            image.setDisplaySize(this.unit, this.unit)
            this.cells.set([row, col], image)
        })
    }
    onDragEnd(shape: Shape) {
        this.settleShape(shape)
        this.clearPhantom()
    }

    clearPhantom() {
        if (this.phantom == null) {
            return
        }

        this.phantom.destroy()
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