import Phaser from 'phaser'
import SceneKeys from '../config/SceneKeys'
import GetConfig from "~/config/Config";
import TextureKeys from "~/config/TextureKeys";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super(SceneKeys.GameOver)
    }

    preload() {
    }

    create() {
        // object destructuring
        const {width, height} = this.scale

        // x, y will be middle of screen
        const x = width * 0.5
        const y = height * 0.5
        const image = this.add.image(x, y, TextureKeys.GameOver)
        image.setOrigin(0.5, 0.5)
        image.setScale(0.6, 0.6)
        image.setInteractive({ cursor: 'pointer' })
        image.on('pointerdown', () => {
            this.scene.start(SceneKeys.Blocktser)
        })
    }
}