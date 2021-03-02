import Phaser from 'phaser'

//import HelloWorldScene from './scenes/HelloWorldScene'
import Blockster from "./scenes/Blocktser";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 600,
	height: 800,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	//scene: [HelloWorldScene]
	scene: [Blockster]
}

export default new Phaser.Game(config)
