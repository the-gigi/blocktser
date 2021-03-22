import Phaser from 'phaser'
import SceneKeys from '../config/SceneKeys'
import GetConfig from "~/config/Config";

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

        // add the text with some styling
        const c = GetConfig(0, 0).gameOver
        const text = this.add.text(x, y, 'Game Over!', {
            fontSize: c.fontSize,
            color: c.color,
            backgroundColor: c.backgroundColor,
            shadow: c.shadow,
            padding: c.padding
        }).setOrigin(0.5)

        text.setInteractive({ cursor: 'pointer' })
        text.on('pointerdown', () => {
            this.scene.start(SceneKeys.Blocktser)
        })
    }
}