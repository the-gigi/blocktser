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
        super(scene, x, y, rows, cols, unit, fillColor, TextureKeys.Backdrop2)
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

    canShapeSettle(shape: Shape, row: number, col: number) : boolean {
        for (const cell of shape.cells) {
            const rr = row + cell[1]
            const cc = col + cell[0]
            if (rr < 0 || cc < 0 || rr >= this.rows || cc >= this.cols) {
                return false
            }

            if (!this.isCellEmpty(rr, cc)) {
                return false
            }
        }
        return true
    }

    settleShape(shape: Shape) {
        // bail out if not on grid
        if (!this.isOnGrid(shape)) {
            this.shapeEventHandler.onDrop(shape, false)
            return
        }

        // bail out if shape intersects with any occupied cell
        const [row, col] = this.findGridLocation(shape)
        if (!this.canShapeSettle(shape, row, col)) {
            this.shapeEventHandler.onDrop(shape, false)
                return
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

    canShapeFit(shape: Shape) : boolean {
        if (shape === null) {
            return false
        }

        for (let row = 0; row < this.rows; ++row) {
            for (let col = 0; col < this.cols; ++col) {
                const key = `${row},${col}`
                if (this.cells.has(key)) {
                    continue
                }
                if (this.canShapeSettle(shape, row, col)) {
                    return true
                }
            }
        }
        return false
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

    isCellEmpty(row, col) {
        const key = `${row},${col}`
        return !this.cells.has(key) || this.cells.get(key) === null
    }

    get completeRows(): number[] {
        let completeRows: number[] = []
        let complete: boolean = false
        for (let row = 0; row < this.rows; ++row) {
            for (let col = 0; col < this.cols; ++col) {
                complete = true
                if (this.isCellEmpty(row, col)) {
                    complete = false
                    break
                }
            }
            if (complete) {
                completeRows.push(row)
            }
        }

        return completeRows
    }

    get completeCols(): number[] {
        let completeCols: number[] = []
        let complete: boolean = false
        for (let col = 0; col < this.cols; ++col) {
            for (let row = 0; row < this.rows; ++row) {
                complete = true
                if (this.isCellEmpty(row, col)) {
                    complete = false
                    break
                }
            }
            if (complete) {
                completeCols.push(col)
            }
        }

        return completeCols
    }

    clearCell(row: number, col: number) {
        const key = `${row},${col}`
        console.log(`clearCell ${key}`)
        if (!this.cells.has(key) || this.cells.get(key) === null) {
            return
        }

        this.cells.get(key).destroy()
        this.cells.set(key, null)
    }

    clearComplete() {
        const completeRows = this.completeRows
        const completeCols = this.completeCols

        for (let row of completeRows) {
            for (let col = 0; col < this.cols; ++col) {
                this.clearCell(row, col)
            }
        }

        for (let col of completeCols) {
            for (let row = 0; row < this.rows; ++row) {
                this.clearCell(row, col)
            }
        }
    }

    onDragging(shape: Shape) {
        const [row, col] = this.findGridLocation(shape)
        if (!this.canShapeSettle(shape, row, col)) {
            this.destroyPhantom()
            return
        }

        this.updatePhantom(shape)
    }
}