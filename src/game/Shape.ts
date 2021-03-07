import Phaser from 'phaser'

export type Pair = [number, number]

export default class Shape extends Phaser.GameObjects.Container {
    private readonly cells!: Phaser.GameObjects.Image[]
    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                unit: number,
                cells: Pair[],
                texture: string) {
        super(scene, x, y)
        // create the shape squares as images
        this.cells = []
        cells.forEach((c) => {
            const xx = x + c[0] * unit
            const yy = y + c[1] * unit
            const image = scene.add.image(xx, yy, texture)
            image.setOrigin(0, 0)
            image.setDisplaySize(unit, unit)
            image.setInteractive()
            scene.input.setDraggable(image);
            this.cells.push(image)
        })

        const shapeCells = this.cells
        scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            const dx = dragX - gameObject.x
            const dy = dragY - gameObject.y
            shapeCells.forEach((c) => {
                c.x += dx;
                c.y += dy;
            })
        })
    }

    preUpdate() {
    }
}