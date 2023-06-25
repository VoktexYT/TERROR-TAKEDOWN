class Credit extends Phaser.Scene {
    constructor() {
        super("credit")
        this.isTheEnds = false;
    }

    preload() {
        this.load.image("bg", "assets/ui/map.png");
    }

    create() {
        this.backgroundImage = this.add.sprite(0, 0, "bg").setOrigin(0, 0);
        this.backgroundImage.setScale(this.game.config.width / this.backgroundImage.width);
        this.backgroundImage.setPosition(0, 0);
        this.backgroundImage.setAlpha(0.5)

        this.cameras.main.setBackgroundColor(0x000000);
        // all credit text
        this.creditText = [
            "~ Terror Takedown ~",
            "This game has created by WinstonWolf007",
            "",
            "[IMAGE / SPRITESHEET]",
            "Player has created by rvros in itch.io",
            "Font has created by codeman38",
            "Map has found in itch.io",
            "Menu has created by PaperHatLizard in itch.io",
            "skeleton head (death count) has created by FrodoUndead in itch.io",
            "Mob item loot has created by Admurin in itch.io",
            "UI button on the interfaces are created by Kicked-in-Teeth in itch.io",
            "",
            "[SOUND / MUSIC]",
            "Background Music by LiteSaturation from Pixabay",
            "Player sword sound effect from Pixabay",
            "Crow sound effect from Pixabay",
            "Upgrate sound Effect from Pixabay",
            "Update pop Sound Effect by SoundReality from Pixabay",
            "background music in game by GioeleFazzeri from Pixabay",
            "Sound Effect upgrade card by PremswaroopKasukurthi from Pixabay",
            "The end"
        ]

        this.allTextObject = [];

        for (let i=0; i<this.creditText.length; i++) {
            this.allTextObject.push(
                this.add.text(this.game.config.width/2, this.game.config.height + i*100, this.creditText[i], {fontSize: 25, fontFamily: "pixelFont"}).setOrigin(0.5, 0)
            )
        }

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.allTextObject[this.allTextObject.length-1].y > -100) {
            let textVelocity = 0.5;

            if (this.cursors.space.isDown) {
                textVelocity = 4;
            }

            for (let txt of this.allTextObject) {
                txt.y -= textVelocity;
            }
        }
        else if (!this.isTheEnds) {
            this.isTheEnds = true;

            this.cameras.main.fadeOut(500, 0, 0, 0);

            let objScene = this;

            this.cameras.main.once('camerafadeoutcomplete', () => {
                objScene.scene.start("menu");
                objScene.scene.stop("credit");
            });
        }
    }
}