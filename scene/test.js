class Test extends Phaser.Scene {
    constructor() {
        super("test");
    }

    preload() {
        this.load.spritesheet("slime", "assets/slime/slime.png", {frameWidth: 280, frameHeight: 170});
    }

    create() {
        this.slime = this.add.image(200, 200, "slime", 0);

        // this.slime.tintBottomLeft = 0x000;
        // this.slime.tintBottomRight = 0x000;
        // this.slime.tintTopLeft = 0x000;
        // this.slime.tintTopRight = 0x000;
        this.slime.setTint(0xff0000)

        console.log(this.slime.tintTopLeft.toString(16));
    }

    update() {

    }
}