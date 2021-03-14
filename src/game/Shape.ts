import Phaser from 'phaser'
import Rectangle = Phaser.Geom.Rectangle;
import ShapeDragHandler, {NoopHandler} from "~/game/Interfaces";

export type Pair = [number, number]

export default class Shape extends Phaser.GameObjects.Container {
    private readonly _cells: Pair[]
    private readonly _images: Phaser.GameObjects.Image[]
    private readonly size: Pair
    private readonly dragScale: number
    private _unit: number
    private _imageDragScale: number
    private readonly dragHandler: ShapeDragHandler

    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                unit: number,
                cells: Pair[],
                texture: string,
                depth: number = 0,
                dragScale: number = 1,
                imageDragScale: number = 1,
                draggable: boolean = false,
                dragHandler: ShapeDragHandler = new NoopHandler()) {
        super(scene, x, y)
        this._unit = unit
        this._imageDragScale = imageDragScale
        this.size = this.calcSize(cells)
        this._cells = cells
        this.dragScale = dragScale
        this.dragHandler = dragHandler
        // create the shape squares as images
        this._images = []
        cells.forEach((c) => {
            const xx = x + c[0] * unit
            const yy = y + c[1] * unit
            const image = scene.add.image(xx, yy, texture)
            image.setDisplaySize(unit, unit)
            image.setDepth(depth)
            if (draggable) {
                image.setInteractive()
                scene.input.setDraggable(image);
            }
            this._images.push(image)
        })

        if (draggable) {
            const self = this
            const shapeImages = this._images
            scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                if (shapeImages.indexOf(gameObject) == -1) {
                    return
                }
                const dx = dragX - gameObject.x
                const dy = dragY - gameObject.y
                self.x += dx
                self.y += dy
                shapeImages.forEach((c) => {
                    c.x += dx;
                    c.y += dy;
                })
                self.dragHandler.onDragging(self)
            })

            scene.input.on('dragstart', function (pointer, gameObject) {
                if (shapeImages.indexOf(gameObject) == -1) {
                    return
                }

                self._unit *= self.dragScale
                self.updateShape()
                self.dragHandler.onDragStart(self)
            })

            scene.input.on('dragend', function (pointer, gameObject) {
                if (shapeImages.indexOf(gameObject) == -1) {
                    return
                }

                self._unit /= self.dragScale
                self.updateShape()
                self.dragHandler.onDragEnd(self)
            })
        }
    }

    get width() {
        return Math.max(...this._cells.map(p => p[0])) + 1
    }

    get height() {
        return Math.max(...this._cells.map(p => p[1])) + 1
    }

    get cells(): Pair[] {
        return this._cells
    }

    get images(): Phaser.GameObjects.Image[] {
        return this._images
    }

    updateShape() {
        for (let i = 0; i < this.cells.length; ++i) {
            const cell = this.cells[i]
            let image = this._images[i]
            image.x = this.x + cell[0] * this._unit
            image.y = this.y + cell[1] * this._unit
            const edge = this._unit * this._imageDragScale
            console.log(`this._imageScale: ${this._imageDragScale}`)
            image.setDisplaySize(edge, edge)
        }
    }

    calcSize(cells: Pair[]) : Pair {
        let width = 0
        let height = 0
        for (let i = 0; i < cells.length; ++i) {
            width = Math.max(width, cells[i][0])
            height = Math.max(height, cells[i][1])
        }
        return [width * this._unit, height * this._unit]
    }

    centerInRect(rect: Rectangle) {
        this.x = rect.x + (rect.width - this.size[0]) / 2
        this.y = rect.y + (rect.height - this.size[1]) / 2

        for (let i = 0; i < this.cells.length; ++i) {
            const cell = this.cells[i]
            const image = this._images[i]
            image.x = this.x + cell[0] * this._unit
            image.y = this.y + cell[1] * this._unit
        }
    }

    preUpdate() {
    }
}