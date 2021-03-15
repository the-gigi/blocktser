import Phaser from 'phaser'
import Shape, {Pair} from "~/game/Shape";
import BaseGrid from "~/game/BaseGrid";
import TextureKeys from "~/config/TextureKeys";
import ShapeDragHandler from "~/game/Interfaces";
import MainEventHandler from "~/game/Interfaces";

export default class MainArea extends BaseGrid
    implements ShapeDragHandler {
    private phantom!: (Shape | null)
    private cells!: Map<string, Phaser.GameObjects.Image>
    private shapeEventHandler!: MainEventHandler

    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                rows: number,
                cols: number,
                unit: number,
                fillColor: number,
                shapeEventHandler: MainEventHandler) {
        super(scene, x, y, rows, cols, unit, fillColor)
        this.phantom = null
        this.cells = new Map<string, Phaser.GameObjects.Image>()
        this.shapeEventHandler = shapeEventHandler
    }

    preUpdate() {
    }

    findGridLocation(shape: Shape): Pair {
        const r = shape.images[0].getBounds()
        const col = Math.round((r.centerX - this.x + this.unit / 2) / this.unit) - 1
        const row = Math.round((r.centerY - this.y + this.unit / 2) / this.unit) - 1
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
        // bail out if not on grid
        if (!this.isOnGrid(shape)) {
            this.shapeEventHandler.onDrop(shape, false)
            return
        }

        // bail out if shape intersects with any occupied cell
        const [row, col] = this.findGridLocation(shape)
        const cells = [...this.cells.keys()]
        for (const cell of shape.cells) {
            const key = `${row + cell[1]},${col + cell[0]}`
            if (cells.includes(key)) {
                this.shapeEventHandler.onDrop(shape, false)
                return
            }
        }

        // Populate cells with the shape's image
        shape.cells.forEach((cell) => {
            const x = this.x + (col + cell[0] + 0.5) * this.unit
            const y = this.y + (row + cell[1] + 0.5) * this.unit
            const image = this.scene.add.image(x, y, shape.texture)
            image.setDisplaySize(this.unit, this.unit)
            const key = `${row + cell[1]},${col + cell[0]}`
            this.cells.set(key, image)
        })
        this.shapeEventHandler.onDrop(shape, true)
    }

    onDragEnd(shape: Shape) {
        this.settleShape(shape)
        this.destroyPhantom()
    }

    destroyPhantom() {
        if (this.phantom == null) {
            return
        }

        this.phantom.destroy()
        this.phantom = null
    }

    get completeRows(): number {
        let completeRowCount = 0

        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {
                let complete = 1
                if (!this.cells.has[`${i},${j}`]) {
                    complete = 0
                    break
                }
                completeRowCount += complete
            }
        }

        return completeRowCount
    }

    get completeCols(): number {
        let completeColCount = 0

        for (let col = 0; col < this.cols; ++col) {
            for (let row = 0; row < this.rows; ++row) {
                let complete = 1
                if (!this.cells.has[`${row},${col}`]) {
                    complete = 0
                    break
                }
                completeColCount += complete
            }
        }

        return completeColCount
    }
    
    onDragging(shape: Shape) {
        if (!this.isOnGrid(shape)) {
            this.destroyPhantom()
            return
        }

        this.updatePhantom(shape)
    }
}