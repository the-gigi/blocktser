import Phaser from 'phaser'
import BaseGrid from "~/game/BaseGrid";
import TopBarConfig from "~/game/TopBarConfig"

export default class TopBar extends BaseGrid {
    private text: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene,
                topBarConfig: TopBarConfig) {
        const c = topBarConfig
        super(scene, c.x, c.y, c.rows, c.cols, c.unit, c.fillColor)

        const w = c.cols * c.unit
        const h = c.rows * c.unit
        const tx = c.x + w / 2
        const ty = c.y + h / 2

        this.text = this.scene.add.text(tx, ty, 'Score: 0', {
            fontSize: c.fontSize,
            color: c.color,
            backgroundColor: c.backgroundColor,
            shadow: c.shadow,
            padding: c.padding
        }).setOrigin(0.5)
    }

    updateScore(newScore: number) {
        this.text.setText('Score: ' + newScore)
    }
}