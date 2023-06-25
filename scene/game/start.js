class Start extends Phaser.Scene {
    constructor() {
        super("start");
        this.lines = [];
    }

    #monsterAnimation_start() {
        for (let m_key in MONSTERS) {
            if (MONSTERS.hasOwnProperty(m_key)) {
                if (MONSTERS[m_key]['nbr'] >= 1) {
                    this.anims.create({
                        key: `monster:${m_key}:move`,
                        frames: this.anims.generateFrameNames(`${m_key}:sprite`, { start: MONSTERS[m_key]["moveFrame"][0], end: MONSTERS[m_key]["moveFrame"][1] }),
                        frameRate: MONSTERS[m_key]["animationSpeed"]["move"],
                        repeat: -1
                    });
    
                    this.anims.create({
                        key: `monster:${m_key}:attack`,
                        frames: this.anims.generateFrameNames(`${m_key}:sprite`, { start: MONSTERS[m_key]["attackFrame"][0], end: MONSTERS[m_key]["attackFrame"][1] }),
                        frameRate: MONSTERS[m_key]["animationSpeed"]["attack"],
                        repeat: -1
                    });
                }
            }
        }
    }

    #playerDeathEvent_update() {
        this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start("menu");
                    this.scene.stop("start");

                    this.player.sprite.destroy();
                    this.bgMusic.stop();
                });
            }
        });
    }

    #monsterDeathCount() {
        let itemsLen = this.all_death_items.length;

        if (itemsLen < 10000000) {
            this.monsterCound.text = itemsLen;
        }
        else {
            this.monsterCound.text = "+99999999";
        }
    }

    createMonster() {
        // random nombre entity
        MONSTERS['slime']['nbr'] = randint(6, 16);
        MONSTERS['crow']['nbr'] = randint(1, 11);

        // this.deleteMonster();
        this.monsters = [];

        // create SLIME monsters
        this.slimes = [];
        for (let slime=0; slime<MONSTERS['slime']['nbr']; slime++) { // spawn 'x' slimes 
            const S = new Monster(this, "slime");
            S.imgKey = "slime:" + ["green", "blue", "red"][randint(0, 2)];
            S.start();
            S.sprite.setOrigin(0.5, 0.5)
            this.slimes.push(S);
        } this.monsters.push(this.slimes);

        // create CROW monsters
        this.crows = [];
        for (let crow=0; crow<MONSTERS['crow']['nbr']; crow++) {
            const C = new Monster(this, "crow");
            C.imgKey = C.config['key']
            C.start();
            this.crows.push(C);
        } this.monsters.push(this.crows);
    }

    deleteMonster() {
        if (this.monsters) {
            for (let t of this.monsters) {
                if (t) {
                    for (let m of t) {
                        m.sprite.destroy();
                    }
                }
            }
        }
        this.monsters = [];
    }

    #createMusicAndSound() {
        this.bgMusic = this.sound.add("bgMusicGame", {
            loop: true,
            volume: 0.75
        });

        this.playerAttackSound = this.sound.add("playerSmash", {
            volume: 1
        });

        this.crowSound = this.sound.add("crowSound", {
            volume: 1
        });

        this.updateXpSound = this.sound.add("upgradeSound", {
            volume: 1
        });

        this.updatePopXpSound = this.sound.add("upgradePopSound", {
            rate: 8
        });

        this.upgradeCardSound = this.sound.add("upgradeCardSound", {
            volume: 1
        });

        this.bgMusic.play();
    }

    create() {
        this.#createMusicAndSound();

        this.player = new Player(this);
        this.all_death_items = [];
        this.monsters = [];
        this.playerDeathEvent = false;
        this.playerBreak = true;
        /*
            MONSTER COUNT
        */

        // image
        this.skeletonHead = this.add.image(0, 0, "skeletonHead").setScrollFactor(0).setDepth(100).setScale(0.1);
        this.skeletonHead.x = this.game.config.width - 130;
        this.skeletonHead.y = this.game.config.height - (this.skeletonHead.height * this.skeletonHead.scale);

        // text
        this.monsterCound = this.add.text(this.game.config.width - 100, this.game.config.height - 43, "100", {fontSize: 20, fontFamily: "pixelFont", color: "#981B1B"}).setScrollFactor(0).setDepth(100);


        /*
            BACKGROUND
        */
        
        // sprite
        this.backgroundImage = this.add.sprite(0, 0, "bg").setOrigin(0, 0);
        this.backgroundImage.setScale(0.4);
        this.backgroundImage.setPosition(0, 0);

        // border
        this.wall_collides = [
            this.add.rectangle(this.backgroundImage.width/2, 120, this.backgroundImage.width, 20, 0xff0000).setVisible(DEBUG['border_map_collide']),  // top
            this.add.rectangle(60, this.backgroundImage.height/2, 20, this.backgroundImage.height, 0xff0000).setVisible(DEBUG['border_map_collide']), // left
            this.add.rectangle(this.backgroundImage.width/2, this.backgroundImage.height-2920, this.backgroundImage.width, 20, 0xff0000).setVisible(DEBUG['border_map_collide']), // bottom
            this.add.rectangle(1290, this.backgroundImage.height/2, 20, this.backgroundImage.height, 0xff0000).setVisible(DEBUG['border_map_collide']), // right
        ];


        /*
            MONSTER
        */

        // create animation
        this.#monsterAnimation_start();


        /*
            PLAYER
        */

        // spawn
        this.player.start();

        // follow cameras
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, this.backgroundImage.displayWidth, this.backgroundImage.displayHeight);


        /*
            GAME CHRONO
        */

        // text
        this.chrono = this.add.text(0, 90, "", {fontSize: 30, fontFamily: "pixelFont", color: "#ffffff"}).setScrollFactor(0).setDepth(100).setOrigin(0.5, 0.5);
        this.chrono.x = this.game.config.width / 2;

        let sec = 5;

        this.chronoLoop = setInterval(() => {
            if (!this.player.upgradeMode) {
                if (sec == 0) {
                    if (this.playerBreak) {
                        // Monster spawns
                        this.playerBreak = false;
                        this.chrono.setColor("#ff0000");
                        this.createMonster();
                        sec = GAME['roundTime'];
                    } else {
                        // Monster destroy
                        this.playerBreak = true;
                        this.chrono.setColor("#00ff00");
                        this.deleteMonster();
                        sec = GAME['playerBreak'];
                    }
                    
                }
                this.chrono.text = sec.toString();
                sec -= 1;
            }
            
        }, 1000);

        this.graphics = this.add.graphics();
    }

    update() {
        /*
            MONSTER RAYS
        */
        if (DEBUG['monster_rays']) {
            // Create a graphics object

            this.graphics.clear();

            // Set line style
            this.graphics.lineStyle(5, 0xff00ff); // lineWidth is the width of the line in pixels

            for (let t of this.monsters) {
                for (let m of t) {
                    // Draw the line
                    this.graphics.beginPath();
                    this.graphics.moveTo(m.sprite.x, m.sprite.y+30);
                    this.graphics.lineTo(this.player.sprite.x, this.player.sprite.y);
                    this.graphics.closePath();
                    this.graphics.setDepth(10000);

                    // Render the graphics object
                    this.graphics.strokePath();
                }
            }
        }

    

        /*
            CHRONO
        */
        
        if (this.player.isDeath) {
            clearInterval(this.chronoLoop)
        }

        /*
            PLAYER
        */

        // update player variable
        this.player.loop();

        
        /*
            MONSTER
        */

        // update monster variable && check monster collide
        if (!this.player.upgradeMode) {
            for (let monster_group of this.monsters) {
                for (let monster of monster_group) {
                    monster.loop();
                    this.player.check_monster_collide(monster);
                }
            }
        }

        // update monster death count
        this.#monsterDeathCount();


        /*
            PLAYER
        */

        // player death event
        if (this.player.isDeath && !this.playerDeathEvent) {
            this.playerDeathEvent = true;
            this.#playerDeathEvent_update();
        }
    }
}