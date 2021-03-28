import Phaser from 'phaser'
import GetConfig, {ComponentConfig, Config, TopBarConfig} from "~/config/Config";
import Shape from "~/game/Shape";
import Pair from "~/game/Shape";
import AudioKeys from "~/config/AudioKeys";
import TextureKeys from "~/config/TextureKeys";
import StagingArea from "~/game/StagingArea";
import MainArea from "~/game/MainArea";
import TopBar from "~/game/TopBar"
import MainEventHandler from "~/game/Interfaces";
import SceneKeys from "~/config/SceneKeys";
import SoundManager from "~/game/SoundManager";

const highScoreKey = 'blocktser/high-score'

export default class Blockster extends Phaser.Scene
    implements MainEventHandler {
    private mainArea!: MainArea
    private topBar!: TopBar
    private stagingArea!: StagingArea
    private soundManager!: SoundManager
    private config!: Config
    private score: number = 0
    private scoreBump: number = 0
    private highScore: number = 0
    private music: Phaser.Sound.BaseSound


    constructor() {
        super('blocktser')
    }

    preload() {
    }

    create() {
        this.highScore = Number(localStorage.getItem(highScoreKey))
        const w = this.physics.world.bounds.width
        const h = this.physics.world.bounds.height
        this.config = GetConfig(w, h)
        this.createMainArea(this.config.mainArea)
        this.createStagingArea(this.config.stagingArea)
        this.createTopBar(this.config.topBar)
        this.soundManager = new SoundManager(this.mainArea.scene)
        if(this.config.playMusic) {
            this.music = this.sound.add(AudioKeys.Music)
            this.music.play({volume: 0.8, loop: true})
        }
    }

    createStagingArea(stagingAreaConfig: ComponentConfig) {
        const c = stagingAreaConfig
        this.stagingArea = new StagingArea(this, c.x, c.y, c.rows, c.cols, c.unit, c.fillColor)
        this.populateStagingArea(c.unit)
    }

    populateStagingArea(unit: number) {
        // add some shapes to staging area
        for (let i = 0; i < 3; ++i) {
            let shape = this.createShape(0, 0, unit, 1, true)
            this.stagingArea.addShape(shape)
        }
    }

    createMainArea(mainAreaConfig: ComponentConfig) {
        const c = mainAreaConfig
        const handler: MainEventHandler = this
        const textStyle = {
            fontSize: c.fontSize,
            color: c.fontColor,
            backgroundColor: c.backgroundColor,
            shadow: c.shadow,
            padding: c.padding
        }
        this.mainArea = new MainArea(this, c.x, c.y, c.rows, c.cols, c.unit, c.fillColor, textStyle, c.scoreBumpDelay, handler)
    }

    createTopBar(topBarConfig: TopBarConfig) {
        this.topBar = new TopBar(this, topBarConfig, this.highScore)
    }

    createShape(x, y, unit: number, depth: number = 0, draggable: boolean = false) {
        const shapes: Pair[][] = [
            [[0, 0], [1, 0], [1, 1], [1, 2]],
            [[0, 0], [0, 1], [1, 1], [2, 1]],
            [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
            [[0, 0]],
            [[0, 0], [0, 1], [0, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
            [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
            [[0, 0], [1, 0], [1, 1], [2, 1]],
            [[0, 0], [0, 1], [1, 1], [1, 2]],
        ]

        // Need to fix and add half a unit
        x += unit / 2
        y += unit / 2
        let cells = shapes[Math.floor(Math.random() * (shapes.length))]

        const textures = [
            TextureKeys.Red,
            TextureKeys.Blue,
            TextureKeys.Green,
            TextureKeys.Orange,
            TextureKeys.Purple,
            TextureKeys.Yellow,
        ]
        const index = Math.floor(Math.random() * textures.length)
        let texture = textures[index]
        const dragHandlers = [this.mainArea, this.stagingArea]
        const dragScale = this.config.dragScale
        const imageDragScale = this.config.imageDragScale
        return new Shape(this, x, y, unit, cells, texture, depth, dragScale, imageDragScale, draggable, dragHandlers)
    }

    update(time: number, delta: number) {
        super.update(time, delta);

        this.mainArea.update(time, delta)
        if (this.gameOver) {
            console.log('game over')
        }
    }

    get gameOver() : boolean {
        return this.stagingArea.shapes.every(s => !this.mainArea.canShapeFit(s))
    }

    handleGameOver() {
        localStorage.setItem(highScoreKey, String(this.highScore))
        this.scene.run(SceneKeys.GameOver)
        this.stagingArea.interactive = false
        this.soundManager.playGameOver()
    }

    updateScore() {
        const rows = this.mainArea.completeRows.length
        const cols = this.mainArea.completeCols.length
        let total = rows + cols
        if (total == 0) {
            return
        }

        // 10 points for every completed row and column
        this.scoreBump = 10 * total
        // 50 points bonus per row, beyond the first one
        this.scoreBump += 50 * Math.max(0, rows - 1);
        // 50 points bonus per column, beyond the first one
        this.scoreBump += 50 * Math.max(0, cols - 1);
        // 50 points bonus for each pair of row and column
        this.scoreBump += 50 * Math.min(rows, cols);
        this.score += this.scoreBump
        this.topBar.updateScore(this.score)
        if (this.score > this.highScore) {
            this.highScore = this.score
            this.topBar.updateHighScore(this.highScore)
        }
    }

    onDrop(shape: Shape, ok: boolean) {
        if (ok) {
            this.soundManager.playPlace()
            this.stagingArea.destroyShape(shape)
            if (this.stagingArea.empty) {
                this.populateStagingArea(this.config.stagingArea.unit)
            }

            this.updateScore()
            if (this.scoreBump > 0) {
                this.mainArea.displayScoreBump(this.scoreBump)
                this.scoreBump = 0
                this.soundManager.playComplete()
            }
            this.mainArea.clearComplete()
            // check for game over
            if (this.gameOver) {
                this.handleGameOver()
            }
        } else {
            this.soundManager.playPlaceFail()
            this.stagingArea.repositionShape(shape)
        }
    }
}
