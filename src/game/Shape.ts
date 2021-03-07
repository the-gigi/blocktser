import Phaser from 'phaser'


type Pair = [number, number]

export default class Shape {
    private cells: Phaser.GameObjects.Graphics[]

    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                unit: number,
                cells: Pair[],
                TextureKeys.) {


        // create the Rocket Mouse sprite
        cells.forEach((c) => {
            const xx = x + c[0] * unit
            const yy = x + c[1] * unit
            const g = scene.add.graphics()
            this.cells.push(scene.add.sprite(xx, yy, ))
        })

        this.cells = scene.add.sprite(0, 0, TextureKeys.RocketMouse)
            .setOrigin(0.5, 1)
            .play(AnimationKeys.RocketMouseRun)

        // create the flames and play the animation
        this.flames = scene.add.sprite(-63, -15, TextureKeys.RocketMouse)
            .play(AnimationKeys.RocketFlamesOn)

        this.createAnimations()

        this.enableJetpack(false)

        this.add(this.flames)
        this.add(this.mouse)

        scene.physics.add.existing(this)

        this.cursors = scene.input.keyboard.createCursorKeys()

        const body = this.body as Phaser.Physics.Arcade.Body

        // use half width and 70% of height
        body.setSize(this.mouse.width * 1.0, this.mouse.height * 1.7)

        // adjust offset to match
        body.setOffset(this.mouse.width * -0.5, -this.mouse.height - 50)
    }

    enableJetpack(enabled: boolean) {
        this.flames.setVisible(enabled)
    }

    preUpdate() {
        const body = this.body as Phaser.Physics.Arcade.Body
        switch (this.mouseState) {
            case MouseState.Running: {


                // check is Space bar is down
                if (this.cursors.space?.isDown) {
                    // set y acceleration to -600 if so
                    body.setAccelerationY(-600)
                    this.enableJetpack(true)
                } else {
                    // turn off acceleration otherwise
                    body.setAccelerationY(0)
                    this.enableJetpack(false)
                }

                // check if touching the ground
                const anim = body.velocity.y > 0 ? AnimationKeys.RocketMouseFall : AnimationKeys.RocketMouseRun
                this.mouse.play(anim, true)
                break;
            }
            case MouseState.Killed: {
                // reduce velocity to 99% of current value
                body.velocity.x *= 0.97

                // once less than 5 we can say stop
                if (body.velocity.x <= 5) {
                    this.mouseState = MouseState.Dead
                }
                break
            }

            case MouseState.Dead: {
                // make a complete stop
                body.setVelocity(0, 0)
                this.scene.events.emit('dead')
                //this.scene.scene.run(SceneKeys.GameOver)
                break
            }
        }
    }

    kill() {
        if (this.mouseState !== MouseState.Running) {
            return
        }
        this.mouseState = MouseState.Killed

        this.mouse.play(AnimationKeys.RocketMouseDead)

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setAccelerationY(0)
        body.setVelocity(1000, 0)
        this.enableJetpack(false)
    }

    private createAnimations() {
        this.mouse.anims.create({
            key: AnimationKeys.RocketMouseRun,
            frames: this.mouse.anims.generateFrameNames(TextureKeys.RocketMouse, {
                start: 1, end: 4, prefix: 'rocketmouse_run', zeroPad: 2, suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1
        })

        this.mouse.anims.create({
            key: AnimationKeys.RocketMouseFall,
            frames: [{
                key: TextureKeys.RocketMouse,
                frame: 'rocketmouse_fall01.png'
            }]
        })

        this.mouse.anims.create({
            key: AnimationKeys.RocketMouseFly,
            frames: [{
                key: TextureKeys.RocketMouse,
                frame: 'rocketmouse_fly01.png'
            }]
        })

        this.mouse.anims.create({
            key: AnimationKeys.RocketMouseDead,
            frames: this.mouse.anims.generateFrameNames(TextureKeys.RocketMouse, {
                start: 1, end: 2, prefix: 'rocketmouse_dead', zeroPad: 2, suffix: '.png'
            }),
            frameRate: 10
        })

        this.flames.anims.create({
            key: AnimationKeys.RocketFlamesOn,
            frames: this.flames.anims.generateFrameNames(TextureKeys.RocketMouse, {
                start: 1,
                end: 2,
                prefix: 'flame',
                suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1
        })
    }
}