import Phaser from 'phaser'
import Blockster from "./scenes/Blocktser";
import Preloader from "~/scenes/Preloader";
import GameOver from "~/scenes/GameOver";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200}
        }
    },
    scene: [Preloader, Blockster, GameOver]
}

export default new Phaser.Game(config)
