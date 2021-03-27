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
        this.load.audio(AudioKeys.PlaceFail, 'audio/no.wav')
        this.load.audio(AudioKeys.GameOver, 'audio/game-over.wav')

        this.load.audio(AudioKeys.Complete1, 'audio/awesome.mp3')
        this.load.audio(AudioKeys.Complete2, 'audio/oh-yeah-low-4.wav')
        this.load.audio(AudioKeys.Complete3, 'audio/oh-yeah-low-4.wav')
        this.load.audio(AudioKeys.Complete4, 'audio/oh-yeah-low-4.wav')
        this.load.audio(AudioKeys.Complete5, 'audio/oh-yeah-low-4.wav')
        this.load.audio(AudioKeys.Complete6, 'audio/oh-yeah-low-4.wav')

        this.load.audio(AudioKeys.Music, 'audio/blocktser.wav')

        this.load.image(TextureKeys.Red, 'images/red.png')
        this.load.image(TextureKeys.Blue, 'images/blue.png')
        this.load.image(TextureKeys.Green, 'images/green.png')
        this.load.image(TextureKeys.Orange, 'images/orange.png')
        this.load.image(TextureKeys.Phantom, 'images/phantom.png')
        this.load.image(TextureKeys.Backdrop, 'images/backdrop.png')
        this.load.image(TextureKeys.Backdrop2, 'images/backdrop2.png')
        this.load.image(TextureKeys.Staging, 'images/staging.png')
    }

    create() {
        this.scene.start(SceneKeys.Blocktser)
    }
}