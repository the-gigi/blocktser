import Phaser from 'phaser'
import AudioKeys from '../config/AudioKeys'
import TextureKeys from '../config/TextureKeys'
import SceneKeys from '../config/SceneKeys'


export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.audio(AudioKeys.Place, 'audio/clunk.wav')
        this.load.audio(AudioKeys.GameOver, 'audio/game-over.wav')
        this.load.audio(AudioKeys.Music, 'audio/blocktser.wav')

        this.load.image(TextureKeys.Red, 'images/red.png')
        this.load.image(TextureKeys.Blue, 'images/blue.png')
        this.load.image(TextureKeys.Phantom, 'images/phantom.png')
        this.load.image(TextureKeys.Backdrop, 'images/backdrop.png')
    }

    create() {
        this.scene.start(SceneKeys.Blocktser)
    }
}