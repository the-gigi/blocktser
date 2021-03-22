import Phaser from 'phaser'
import TextureKeys from '~/config/TextureKeys'



export type Pair = [number, number]

export default class BaseGrid extends Phaser.GameObjects.Container {
    protected readonly unit!: number
    protected readonly rows!: number
    protected readonly cols!: number
    protected readonly image!: Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                rows: number,
                cols: number,
                unit: number,
                fillColor: number,
                texture: string = '') {
        super(scene, x, y)
        this.rows = rows
        this.cols = cols
        this.unit = unit

        const u = unit
        const w = u * cols
        const h = u * rows
        const xx = this.x + w /2
        const yy = this.y + h / 2

        if (texture !== '') {
            this.image = this.scene.add.image(xx, yy, texture)
            this.image.setDisplaySize(w, h)
        } else {
            this.scene.add.grid(xx, yy, w, h, u, u, fillColor)
        }
    }
}