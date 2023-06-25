class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    preload() {
        this.load.spritesheet("menu", "assets/ui/menu.png", { frameWidth: 640, frameHeight: 800 });
        this.load.spritesheet("player_bg", "assets/player/adventurer-Sheet.png", {frameWidth: 500, frameHeight: 370});
        this.load.audio("bgMusic", "assets/music/epicaly-113907.mp3")
    }

    create() {
        const this_ = this;

        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // create player in wallpaper
        this.player_bg = this.add.sprite(20, 0, "player_bg").setOrigin(0, 0)

        this.player_bg.setScale(0.3)

        this.player_bg.y = this.game.config.height - this.player_bg.height * this.player_bg.scale

        this.anims.create({
            key: "playerAnims_bg",
            frames: this.anims.generateFrameNames("player_bg", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.player_bg.anims.play("playerAnims_bg");


        // create menu
        this.menu = this.add.sprite(0, 0, "menu").setOrigin(0, 0)
        this.menu.setScale(0.9)
        this.menu.x = (this.game.config.width - this.menu.width * this.menu.scale) / 2;
        this.menu.y = (this.game.config.height - this.menu.height * this.menu.scale) / 2;

        this.anims.create({
            key: "openMenu",
            frames: this.anims.generateFrameNames("menu", { start: 12, end: 0 }),
            frameRate: 40,
            repeat: 0
        })

        this.menu.anims.play("openMenu");

        // create a text object
        this.addAllText = false;
        this.cameras.main.setBackgroundColor(0x7AAA9E);
        this.allTexts = [];
        this.cursorsIdx = 0;
        this.marginBottomText = 150;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.after_time_down = 0;

        this.changeScene = false;

        // create munu cursor select sys
        this.down_press = false;
        this.up_press = false;

        this.cursors.down.on("down", () => {
            if (!this.down_press) {
                if (this.cursorsIdx+1 <= 2) {
                    this.cursorsIdx++;
                } else {
                    this.cursorsIdx = 0;
                }
    
                this.textAnim();
                this.down_press = true;
            }
        });

        this.cursors.down.on("up", () => {
            if (this.down_press) {
                this.down_press = false;
            }
        });

        this.cursors.up.on("down", () => {
            if (!this.up_press) {
                if (this.cursorsIdx-1 >= 0) {
                    this.cursorsIdx--;
                } else {
                    this.cursorsIdx = 2;
                }
    
                this.textAnim();
                this.up_press = true;
            }
        });

        this.cursors.up.on("up", () => {
            if (this.up_press) {
                this.up_press = false;
            }
        });

        this.cursors.space.once("up", () => {
            if (!this.changeScene) {
                this.changeScene = true;
                switch (this.allTexts[this.cursorsIdx].text) {
                    case "START":
                        this.cameras.main.fadeOut(500, 0, 0, 0);
                        this.cameras.main.once('camerafadeoutcomplete', () => {
                            this.tweens.add({
                                targets: this_.music,
                                volume: 0,
                                duration: 500,
                                onComplete: function() {
                                    this_.music.stop(); 
                                    this_.scene.start("load:game");
                                    this_.scene.stop("menu");
                                }
                            });
                        });
                        break;
    
                    case "SETTINGS":
                        this.cameras.main.fadeOut(500, 0, 0, 0);
                        this.cameras.main.once('camerafadeoutcomplete', () => {
                            this.scene.start("settings");
                            this.scene.stop("menu");
                        });
                        this.music.stop();
                        break;
                    
                    case "CREDIT":
                        this.cameras.main.fadeOut(500, 0, 0, 0);
                        this.cameras.main.once('camerafadeoutcomplete', () => {
                            this.scene.start("credit");
                            this.scene.stop("menu");
                        });
                        this.music.stop();
                        break;
                }
            }
        });

        this.music = this.sound.add("bgMusic", {volume: 1, loop: true});
        this.music.play();
    }

    textAnim() {
        this.tweens.killAll();

        for (let t of this.allTexts) {
            t.setAlpha(1);
        }

        this.tweens.add({
            targets: this.allTexts[this.cursorsIdx],
            duration: 200,
            repeat: -1,
            alpha: 0
        });
    }

    update() {
        // Animation to start of scene
        if (!this.addAllText && this.menu.anims.getProgress() == 1) {
            this.addAllText = true;
            this.allTexts = [
                this.add.text(0, 240, 'START', { fontFamily: "pixelFont", fontSize: 35, color: "#B86F50"}).setData({"first": true}),
                this.add.text(0, 0, 'SETTINGS', { fontFamily: "pixelFont", fontSize: 35, color: "#B86F50"}).setData({"first": false}),
                this.add.text(0, 0, 'CREDIT', { fontFamily: "pixelFont", fontSize: 35, color: "#B86F50"}).setData({"first": false})
            ];

            let idx = 0;

            for (let txt of this.allTexts) {
                txt.setOrigin(0.5);
                txt.x = this.game.config.width / 2;

                if (!txt.getData("first")) {
                    txt.y = this.allTexts[0].y + idx * this.marginBottomText;
                }

                idx++;
            }

            this.tweens.add({
                targets: this.allTexts[0],
                duration: 200,
                repeat: -1,
                alpha: 0
            });
        }
    }
}