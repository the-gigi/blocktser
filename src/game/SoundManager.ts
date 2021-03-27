import AudioKeys from "~/config/AudioKeys";
import Phaser from "phaser";

export default class SoundManager {
    private readonly sound: Phaser.Sound.BaseSoundManager
    private readonly completeKeys: string[]
    private readonly gameOverKeys: string[]




    constructor(scene: Phaser.Scene) {
        this.sound = scene.sound
        this.completeKeys = [
            AudioKeys.Complete1,
            AudioKeys.Complete2,
            AudioKeys.Complete3,
            AudioKeys.Complete4,
            AudioKeys.Complete5,
            AudioKeys.Complete6,
        ]
        this.gameOverKeys = [
            AudioKeys.GameOver,
        ]

    }

    pickSound(sounds: string[]) {
        return sounds[Math.floor(Math.random() * sounds.length)]
    }

    playPlace() {
        this.sound.play(AudioKeys.Place)
    }

    playPlaceFail() {
        this.sound.play(AudioKeys.PlaceFail)
    }

    playComplete() {
        this.sound.play(this.pickSound(this.completeKeys))
    }

    playGameOver() {
        this.sound.play(this.pickSound(this.gameOverKeys))
    }
}