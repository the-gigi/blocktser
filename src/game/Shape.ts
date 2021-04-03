import Phaser from 'phaser'
import Rectangle = Phaser.Geom.Rectangle;
import ShapeDragHandler from "~/game/Interfaces";

export type Pair = [number, number]

export default class Shape extends Phaser.GameObjects.Container {
    private _unit: number
    private _imageDragScale: number
    private _boundingBox: Rectangle

    private readonly _cells: Pair[]
    private readonly _images: Phaser.GameObjects.Image[]
    private readonly _draggable: boolean
    private readonly size: Pair
    private readonly dragScale: number
    private readonly _texture: string
    private readonly dragHandlers: ShapeDragHandler[]


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
                dragHandlers: ShapeDragHandler[]) {
        super(scene, x, y)
        this._unit = unit
        this._texture = texture
        this._imageDragScale = imageDragScale
        this._draggable = draggable
        this.size = this.calcSize(cells)
        this._cells = cells
        this.dragScale = dragScale
        this.dragHandlers = dragHandlers
        this._boundingBox = this.getBounds()
        // create the shape squares as images
        this._images = []
        const self = this
        cells.forEach((c) => {
            const xx = x + c[0] * unit
            const yy = y + c[1] * unit
            const image = scene.add.image(xx, yy, texture)
            image.setDisplaySize(unit, unit)
            image.setDepth(depth)
            if (draggable) {
                image.setInteractive({ cursor: 'pointer'})
                scene.input.setDraggable(image);
            }
            this._images.push(image)
        })

        if (!draggable) {
            return
        }

        this.setInteractive({ cursor: 'pointer'})
        scene.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            self.onDragging(self, pointer, gameObject, dragX, dragY)
        })

        scene.input.on('dragstart', function (pointer, gameObject) {
            self.onDragStart(self, pointer, gameObject)
        })

        scene.input.on('dragend', function (pointer, gameObject) {
            self.onDragEnd(self, pointer, gameObject)
        })
    }

    onDragging(shape, pointer, gameObject, dragX, dragY) {
        if (shape._images.indexOf(gameObject) == -1) {
            return
        }
        const dx = dragX - gameObject.x
        const dy = dragY - gameObject.y
        shape.x += dx
        shape.y += dy
        shape._images.forEach((c) => {
            c.x += dx;
            c.y += dy;
        })
        shape.dragHandlers.forEach((h) => h.onDragging(shape))        
    }
    
    onDragStart(shape, pointer, gameObject) {
        if (shape._images.indexOf(gameObject) == -1) {
            return
        }
    
        shape._unit *= shape.dragScale
        shape.updateShape(true)
        shape.dragHandlers.forEach((h) => h.onDragStart(shape))
    }

    onDragEnd(shape, pointer, gameObject) {
        if (shape._images.indexOf(gameObject) == -1) {
            return
        }

        shape._unit /= shape.dragScale
        shape.updateShape(false)
        shape.dragHandlers.forEach((h) => h.onDragEnd(shape))
    }
    updateHitArea() {

    }

    get texture(): string {
        return this._texture
    }
    get width(): number {
        return Math.max(...this._cells.map(p => p[0])) + 1
    }

    get height(): number {
        return Math.max(...this._cells.map(p => p[1])) + 1
    }

    get cells(): Pair[] {
        return this._cells
    }

    get images(): Phaser.GameObjects.Image[] {
        return this._images
    }

    destroy() {
        this.images.forEach((image) => image.destroy())
    }

    updateShape(scaleImages: boolean) {
        const scaleFactor = scaleImages ? this._imageDragScale : 1
        const edge = this._unit * scaleFactor

        for (let i = 0; i < this.cells.length; ++i) {
            const cell = this.cells[i]
            let image = this._images[i]
            image.x = this.x + cell[0] * this._unit
            image.y = this.y + cell[1] * this._unit
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
        // if (this._draggable) {
        //     this.setInteractive({hitArea: rect, hitAreaCallback: Rectangle.Contains, useHandCursor: true})
        //     this.scene.input.setDraggable(this);
        // }
        this._boundingBox = rect
        this.x = rect.x + (rect.width - this.size[0]) / 2
        this.y = rect.y + (rect.height - this.size[1]) / 2

        for (let i = 0; i < this.cells.length; ++i) {
            const cell = this.cells[i]
            const image = this._images[i]
            image.x = this.x + cell[0] * this._unit
            image.y = this.y + cell[1] * this._unit
        }
    }

    resetImageDragScale() {
        this._imageDragScale = 1
    }
}