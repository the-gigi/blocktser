import Phaser from 'phaser'
import Rectangle = Phaser.Geom.Rectangle;
import ShapeDragHandler from "~/game/Interfaces";
import TextureKeys from "~/config/TextureKeys";

export type Pair = [number, number]

//export default class Shape extends Phaser.GameObjects.Container {
export default class Shape {
    private _unit: number
    private _imageDragScale: number
    private _container!: Phaser.GameObjects.Container

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
        //super(scene, x, y)
        this._unit = unit
        this._texture = texture
        this._imageDragScale = imageDragScale
        this._draggable = draggable
        this.size = this.calcSize(cells)
        this._cells = cells
        this.dragScale = dragScale
        this.dragHandlers = dragHandlers
        // create the shape squares as images
        this._images = []
        const self = this

        cells.forEach((c) => {
            const image = scene.add.image(0, 0, texture)
            image.setDisplaySize(unit, unit)
            image.setDepth(depth)
            this._images.push(image)
        })

        this.positionImages()
        this._container = scene.add.container(x, y, this._images)
        if (!draggable) {
            return
        }

        // Add border to container
        // const rect = scene.add.rectangle(0, 0, 5 * unit, 5 * unit)
        // rect.setStrokeStyle(1, 0xff00ff)
        // this._container.add(rect)

        this._container.setSize(5 * unit, 5 * unit)

        this._container.setInteractive({cursor: 'pointer'})
        scene.input.setDraggable(this._container);
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

    set enabled(value: boolean) {
        const t = value ? this.texture : TextureKeys.Phantom
        this._images.forEach((image) => image.setTexture(t))
        if (value) {
            this._container.setInteractive()
        } else {
            this._container.disableInteractive()
        }
    }

    positionImages() {
        const w = Math.max(...this.cells.map(c => c[0]))
        const h = Math.max(...this.cells.map(c => c[1]))
        const offsetX = w / 2
        const offsetY = h / 2

        for (let i = 0; i < this.cells.length; ++i) {
            const cell = this.cells[i]
            const image = this._images[i]
            image.x = (cell[0] - offsetX) * this._unit
            image.y = (cell[1] - offsetY) * this._unit
        }
    }

    onDragging(shape, pointer, gameObject, dragX, dragY) {
        if (shape._container !== gameObject) {
            return
        }
        const dx = dragX - gameObject.x
        const dy = dragY - gameObject.y
        shape._container.x += dx
        shape._container.y += dy
        shape.dragHandlers.forEach((h) => h.onDragging(shape))
    }

    onDragStart(shape, pointer, gameObject) {
        if (shape._container !== gameObject) {
            return
        }
    
        shape._unit *= shape.dragScale
        shape.updateShape(true)
        shape.dragHandlers.forEach((h) => h.onDragStart(shape))
    }

    onDragEnd(shape, pointer, gameObject) {
        if (shape._container !== gameObject) {
            return
        }

        shape._unit /= shape.dragScale
        shape.updateShape(false)
        shape.dragHandlers.forEach((h) => h.onDragEnd(shape))
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

    move(x: number, y: number) {
        this._container.setPosition(x, y)
    }

    destroy() {
        this.images.forEach((image) => image.destroy())
    }

    updateShape(scaleImages: boolean = false) {
        const scaleFactor = scaleImages ? this._imageDragScale : 1
        console.log(`updateShape(), scaleFactor: ${scaleFactor}`)
        const edge = this._unit * scaleFactor

        for (let i = 0; i < this.cells.length; ++i) {
            const cell = this.cells[i]
            let image = this._images[i]
            //image.x = this.x + cell[0] * this._unit
            //image.y = this.y + cell[1] * this._unit
            image.x = cell[0] * this._unit
            image.y = cell[1] * this._unit
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
        const dim = 5 * this._unit
        const x = rect.x + (rect.width) / 2
        const y = rect.y + (rect.height) / 2
        this._container.setPosition(x, y)
        this._container.setSize(dim, dim)
        this._container.setDepth(1)
        this.positionImages()
    }

    resetImageDragScale() {
        this._imageDragScale = 1
    }
}