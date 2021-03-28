import Phaser from 'phaser'
import BaseGrid from "~/game/BaseGrid";
import TopBarConfig from "~/game/TopBarConfig"

export default class TopBar extends BaseGrid {
    private score: Phaser.GameObjects.Text
    private highScore: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene,
                topBarConfig: TopBarConfig,
                highScore: number) {
        const c = topBarConfig
        super(scene, c.x, c.y, c.rows, c.cols, c.unit, c.fillColor)

        const textStyle = {
            fontSize: c.fontSize,
            color: c.color,
            backgroundColor: c.backgroundColor,
            shadow: c.shadow,
            padding: c.padding
        }

        const x = this.x + c.offset
        const y1 = this.y + this.rows * this.unit / 3


        this.score = this.scene.add.text(x, y1, '', textStyle).setOrigin(0, 0.5)
        const y2 = y1 + this.score.height + c.offset
        this.highScore = this.scene.add.text(x, y2, '', textStyle).setOrigin(0, 0.5)

        this.updateScore(0)
        this.updateHighScore(highScore)
    }

    get width() : number {
        return this.cols * this.unit
    }

    updateScore(newScore: number) {
        this.score.setText('Score: ' + newScore)
    }

    updateHighScore(newHighScore: number) {
        this.highScore.setText('High Score: ' + newHighScore)
    }
}