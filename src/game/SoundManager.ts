import AudioKeys from "~/config/AudioKeys";
import Phaser from "phaser";

export default class SoundManager {
    private readonly sound: Phaser.Sound.BaseSoundManager
    private readonly completeKeys: string[]
    private readonly gameOverKeys: string[]

    constructor(scene: Phaser.Scene) {
        this.sound = scene.sound
    }

    pickSound(sounds: string[]) {
        return sounds[Math.floor(Math.random() * sounds.length)]
    }

    playPlace() {
        this.sound.play(this.pickSound(AudioKeys.place))
    }

    playPlaceFail() {
        this.sound.play(this.pickSound(AudioKeys.placeFail))
    }

    playClear() {
        this.sound.play(this.pickSound(AudioKeys.clear))
    }

    playGameOver() {
        this.sound.play(this.pickSound(AudioKeys.gameOver))
    }
}