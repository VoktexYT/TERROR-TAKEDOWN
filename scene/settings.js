class Settings extends Phaser.Scene {
    constructor() {
        super("settings")
    }

    preload() {

    }

    create() {
        const this_ = this;

        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cameras.main.setBackgroundColor(0x7AAA9E);

        this.back = this.add.text(0, 500, "BACK", {fontSize: 40, fontFamily: "pixelFont", color: "#B86F50"}).setInteractive();
        this.back.x = (this.game.config.width - this.back.width) / 2;
        this.back.on("pointerover", () => {
            setCursor("pointer");
        });

        this.back.on("pointerout", () => {
            setCursor("default");
        });

        this.back.on("pointerdown", () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this_.scene.start("menu");
                this_.scene.stop("settings");
            });
        });
    }

    update() {
    }
}