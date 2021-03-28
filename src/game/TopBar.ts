import Phaser from 'phaser'
import BaseGrid from "~/game/BaseGrid"
import TopBarConfig from "~/game/TopBarConfig"
import TextureKeys from "~/config/TextureKeys"

export default class TopBar extends BaseGrid {
    private score: Phaser.GameObjects.Text
    private highScore: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene,
                topBarConfig: TopBarConfig,
                highScore: number) {
        const c = topBarConfig
        super(scene, c.x, c.y, c.rows, c.cols, c.unit, c.fillColor, TextureKeys.TopBar)

        const textStyle = {
            fontFamily: c.fontFamily
            fontSize: c.fontSize,
            color: c.color,
            backgroundColor: c.backgroundColor,
            shadow: c.shadow,
            padding: c.padding
        }

        const x1 = this.x + c.unit
        const x2 = this.x + c.unit * 6
        const y = this.y + c.unit * 2.25


        this.score = this.scene.add.text(x1, y, '', textStyle).setOrigin(0, 0.5)
        this.highScore = this.scene.add.text(x2, y, '', textStyle).setOrigin(0, 0.5)

        this.updateScore(0)
        this.updateHighScore(highScore)
    }

    get width() : number {
        return this.cols * this.unit
    }

    updateScore(newScore: number) {
        this.score.setText(newScore)
    }

    updateHighScore(newHighScore: number) {
        this.highScore.setText(newHighScore)
    }
}