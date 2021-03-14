import Phaser from 'phaser'
import Rectangle = Phaser.Geom.Rectangle;

export type Pair = [number, number]

export default class Shape extends Phaser.GameObjects.Container {
    private readonly cells: Pair[]
    private readonly images: Phaser.GameObjects.Image[]
    private readonly size: Pair
    private readonly dragScale: number
    private unit: number

    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                unit: number,
                cells: Pair[],
                texture: string,
                dragScale: number,
                draggable: boolean = false) {
        super(scene, x, y)
        this.unit = unit
        this.size = this.calcSize(cells)
        this.cells = cells
        this.dragScale = dragScale
        // create the shape squares as images
        this.images = []
        cells.forEach((c) => {
            const xx = x + c[0] * unit
            const yy = y + c[1] * unit
            const image = scene.add.image(xx, yy, texture)
            image.setDisplaySize(unit, unit)
            if (draggable) {
                image.setInteractive()
                scene.input.setDraggable(image);
            }
            this.images.push(image)
        })

        if (draggable) {
            const self = this
            const shapeImages = this.images
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
            })

            scene.input.on('dragstart', function (pointer, gameObject) {
                if (shapeImages.indexOf(gameObject) == -1) {
                    return
                }

                self.unit *= self.dragScale
                self.updateShape()
            })

            scene.input.on('dragend', function (pointer, gameObject) {
                if (shapeImages.indexOf(gameObject) == -1) {
                    return
                }

                self.unit /= self.dragScale
                self.updateShape()
            })
        }
    }

    updateShape() {
        for (let i = 0; i < this.cells.length; ++i) {
            const cell = this.cells[i]
            let image = this.images[i]
            image.x = this.x + cell[0] * this.unit
            image.y = this.y + cell[1] * this.unit
            image.setDisplaySize(this.unit, this.unit)
        }
    }

    calcSize(cells: Pair[]) : Pair {
        let width = 0
        let height = 0
        for (let i = 0; i < cells.length; ++i) {
            width = Math.max(width, cells[i][0])
            height = Math.max(height, cells[i][1])
        }
        return [width * this.unit, height * this.unit]
    }

    centerInRect(rect: Rectangle) {
        this.x = rect.x + (rect.width - this.size[0]) / 2
        this.y = rect.y + (rect.height - this.size[1]) / 2

        for (let i = 0; i < this.cells.length; ++i) {
            const cell = this.cells[i]
            const image = this.images[i]
            image.x = this.x + cell[0] * this.unit
            image.y = this.y + cell[1] * this.unit
        }
    }

    preUpdate() {
    }
}