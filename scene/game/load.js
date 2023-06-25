class Load_Game extends Phaser.Scene {
    constructor() {
        super({
            key: "load:game"
        });
    }

    preload() {
        /*
            ALL LOAD
        */
        this.load.audio("bgMusicGame", "assets/music/beyond-new-horizons-free-epic-viking-medieval-.mp3");
        this.load.audio("playerSmash", "assets/sound/sword-sound-2-36274.mp3");
        this.load.audio("crowSound", "assets/sound/crow1-5986.mp3");
        this.load.audio("upgradeSound", "assets/sound/dsi-90512.mp3");
        this.load.audio("upgradePopSound", "assets/sound/boom-128320.mp3");
        this.load.audio("upgradeCardSound", "assets/sound/hit-sound-effect-12445.mp3");

        this.load.spritesheet("upgrade0", "assets/upgrades/upgrate0.png", {frameWidth: 400, frameHeight: 400});
        this.load.spritesheet("upgrade1", "assets/upgrades/upgrate1.png", {frameWidth: 400, frameHeight: 400});
        this.load.spritesheet("upgrade2", "assets/upgrades/upgrate2.png", {frameWidth: 400, frameHeight: 400});
        
        this.load.spritesheet("buttonUI", "assets/ui/ButtonUI.png", {frameWidth: 160, frameHeight: 160});

        this.load.image("bg", "assets/ui/map.png");
        this.load.json("settings", "settings.json");
        this.load.image("skeletonHead", "./assets/ui/skeletonHead.png");

        this.load.spritesheet(PLAYER["key"], "assets/player/adventurer-Sheet.png", {frameWidth: 500, frameHeight: 370});
        this.load.spritesheet("health_shield_bar", "assets/ui/health_shield_bar.png", {frameWidth: 1130, frameHeight: 160});

        // load all monster image
        for (let key in MONSTERS) {
            this.load.spritesheet(MONSTERS[key]["key"], MONSTERS[key]["sheet_src"], {frameWidth: MONSTERS[key]["frameSize"][0], frameHeight: MONSTERS[key]["frameSize"][1]});
            this.load.image(MONSTERS[key]["type"] + ":item_image", MONSTERS[key]["loot_src"]);
        }

        // start new scene
        let scene = this.scene;
        this.load.on('complete', function () {
            scene.start("start");
            scene.stop("load:game");
        });
    }
}