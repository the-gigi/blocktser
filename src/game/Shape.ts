import Phaser from 'phaser'
import Rectangle = Phaser.Geom.Rectangle;

export type Pair = [number, number]

export default class Shape extends Phaser.GameObjects.Container {
    private readonly cells: Pair[]
    private readonly images: Phaser.GameObjects.Image[]
    private readonly unit: number
    private readonly size: Pair
    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                unit: number,
                cells: Pair[],
                texture: string,
                draggable: boolean = false) {
        super(scene, x, y)
        this.unit = unit
        this.size = this.calcSize(cells)
        this.cells = cells
        // create the shape squares as images
        this.images = []
        cells.forEach((c) => {
            const xx = x + c[0] * unit
            const yy = y + c[1] * unit
            const image = scene.add.image(xx, yy, texture)
            //image.setOrigin(0, 0)
            image.setDisplaySize(unit, unit)
            if (draggable) {
                image.setInteractive()
                scene.input.setDraggable(image);
            }
            this.images.push(image)
        })

        if (draggable) {
            const shapeImages = this.images
            scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                const dx = dragX - gameObject.x
                const dy = dragY - gameObject.y
                shapeImages.forEach((c) => {
                    c.x += dx;
                    c.y += dy;
                })
            })
        }
    }

    calcSize(cells: Pair[]) : Pair {
        let width = 0
        let height = 0
        for (let i = 0; i < cells.length; ++i) {
            width = Math.max(width, cells[i][0])
            height = Math.max(height, cells[i][1])
        }
        console.log(`width: ${width}, height: ${height}`)
        let size : Pair = [width * this.unit, height * this.unit]
        console.log(`size: ${size[0]}, ${size[1]}`)
        return size
    }

    centerInRect(rect: Rectangle) {
        console.log(`rect.top: ${rect.top}, rect.bottom: ${rect.bottom}`)
        console.log(`shape.y: ${this.y}`)
        console.log(`shape.size: [${this.size[0]}, ${this.size[1]}]`)
        this.x = rect.x + (rect.width - this.size[0]) / 2
        this.y = rect.y + (rect.height - this.size[1]) / 2

        for (let i = 0; i < this.cells.length; ++i) {
            const cell = this.cells[i]
            const image = this.images[i]
            image.x = this.x + cell[0] * this.unit
            image.y = this.y + cell[1] * this.unit
            console.log(`cell[1]: ${cell[1]}, image.y: ${image.y}`)
        }

        console.log('done')
    }

    preUpdate() {
    }
}