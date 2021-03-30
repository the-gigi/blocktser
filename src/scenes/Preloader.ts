import Phaser from 'phaser'
import AudioKeys from '../config/AudioKeys'
import TextureKeys from '../config/TextureKeys'
import SceneKeys from '../config/SceneKeys'


export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        Object.entries(AudioKeys).forEach(([_, filenames]) => {
            filenames.forEach((filename) => {
                this.load.audio(filename, filename)
            }, this)
        }, this)

        this.load.image(TextureKeys.Red, 'images/red.png')
        this.load.image(TextureKeys.Blue, 'images/blue.png')
        this.load.image(TextureKeys.Green, 'images/green.png')
        this.load.image(TextureKeys.Orange, 'images/orange.png')
        this.load.image(TextureKeys.Purple, 'images/purple.png')
        this.load.image(TextureKeys.Yellow, 'images/yellow.png')

        this.load.image(TextureKeys.Phantom, 'images/phantom.png')
        this.load.image(TextureKeys.Backdrop, 'images/backdrop.png')
        this.load.image(TextureKeys.Backdrop2, 'images/backdrop2.png')
        this.load.image(TextureKeys.Staging, 'images/staging.png')
        this.load.image(TextureKeys.TopBar, 'images/topbar.png')
        this.load.image(TextureKeys.GameOver, 'images/game over.png')
    }

    create() {
        this.scene.start(SceneKeys.Blocktser)
    }
}