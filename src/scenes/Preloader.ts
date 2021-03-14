import Phaser from 'phaser'
import TextureKeys from '../config/TextureKeys'
import SceneKeys from '../config/SceneKeys'


export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image(TextureKeys.Red, 'images/red.png')
        this.load.image(TextureKeys.Blue, 'images/blue.png')
        this.load.image(TextureKeys.Phantom, 'images/phantom.png')
    }

    create() {
        this.scene.start(SceneKeys.Blocktser)
    }
}