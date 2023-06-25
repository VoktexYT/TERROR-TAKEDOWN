class Player {
    constructor(game) {
        /**
         * @type {Start}
         */

        this.game = game;
        this.attack_mode = false;
        this.isDeath = false;

        this.damage = PLAYER["damage"];
        this.velocity = PLAYER["velocity"];
        this.health = PLAYER['max_health'];
        this.attack_velocity = 2; // max 5
        this.maxHealth = PLAYER["max_health"];

        this.update = UPGRADES;

        this.upgradeMode = false;
        this.oneUpgradeClick = false;
        this.updateIconScale = 0.4;
    }

    start() {
        // New sprite object
        this.sprite = this.game.add.sprite(100, 100, PLAYER["key"]);
        this.sprite.setScale(PLAYER["scale"]);
        this.sprite.setDepth(1);

        this.eventText = this.game.add.text(this.game.game.config.width/2, this.game.game.config.height-50, "", {fontFamily: "pixelFont", color: "#000000", fontSize: 25}).setDepth(100).setAlpha(0).setScrollFactor(0).setOrigin(0.5, 0.5);

        // sprite properties
        this.game.physics.add.existing(this.sprite);
        this.sprite.body.setSize(300, 300)

        // animation
        this.iddleAnims = this.sprite.anims.create({
            key: 'player:iddle',
            frames: this.game.anims.generateFrameNumbers(PLAYER["key"], { start: 0, end: 3 }),
            frameRate: PLAYER["velocity"] * 2,
            repeat: 0
        });

        this.runAnims = this.sprite.anims.create({
            key: 'player:run',
            frames: this.game.anims.generateFrameNumbers(PLAYER["key"], { start: 8, end: 13 }),
            frameRate: PLAYER["velocity"] * 2,
            repeat: 0
        });

        this.doubleAttackAnims = this.sprite.anims.create({
            key: 'player:attack',
            frames: this.game.anims.generateFrameNumbers(PLAYER["key"], { start: 40, end: 52 }),
            frameRate: this.attack_velocity * 6,
            repeat: 0
        });

        this.doubleAttackAnimsStart = this.attack_velocity * 6;

        this.deathAnims = this.sprite.anims.create({
            key: "player:death",
            frames: this.game.anims.generateFrameNumbers(PLAYER["key"], { start: 60, end: 68 }),
            frameRate: 20,
            repeat: 0
        });

        // Arrows key button
        this.cursors = this.game.input.keyboard.createCursorKeys();

        // Health
        this.health_bar = this.game.add.sprite(150, 750, "health_shield_bar", 0).setScrollFactor(0).setDepth(100).setScale(0.2);

        // attack collide
        const VISBLE_RECT = DEBUG['attack'];

        this.rightCollideAttack = this.game.add.rectangle(0, 0, 100, 150, 0xff0000).setVisible(VISBLE_RECT);
        this.leftCollideAttack = this.game.add.rectangle(0, 0, 100, 150, 0xff0000).setVisible(VISBLE_RECT);

        // foot collide
        this.footCollide = this.game.add.rectangle(0, 0, 60, 20, 0xffff00).setVisible(false);

        if (DEBUG['border_map_collide']) {
            this.footCollide.setVisible(true);
        }

        // experience
        this.experienceBG = this.game.add.rectangle(530, 40, 900, 20, 0x000078).setScrollFactor(0).setDepth(100);
        this.experienceFG = this.game.add.rectangle(90, 40, 0, 10, 0x00ffff).setScrollFactor(0).setDepth(100);
    }

    #footCollide_update() {
        this.footCollide.x = this.sprite.x;
        this.footCollide.y = this.sprite.y + 50
    }

    #attackRectCollide_update() {
        this.rightCollideAttack.x = this.sprite.x + this.rightCollideAttack.width/2;
        this.rightCollideAttack.y = this.sprite.y - 30;

        this.leftCollideAttack.x = this.sprite.x - this.leftCollideAttack.width/2;
        this.leftCollideAttack.y = this.sprite.y - 30;

        if (this.sprite.anims.getName() === "player:attack") {
            let progress = this.sprite.anims.getProgress();

            if (DEBUG['attack']) {
                console.log(progress);
            }

            let color = 0xff0000;

            if (progress == 0.25 || progress == 0.75) {
                this.game.playerAttackSound.rate = this.doubleAttackAnims.frameRate/this.doubleAttackAnimsStart;
                this.game.playerAttackSound.play();
            }

            if ((progress == 0.25) || (progress == 0.41666666666666663) || (progress == 0.5833333333333333) || (progress == 0.75) || (progress > 0.90 && progress < 1)) {
                color = 0xffff00;
            }
            else {
                color = 0xff0000;
            }

            if (this.sprite.flipX) {
                this.leftCollideAttack.fillColor = color;
            }
            else {
                this.rightCollideAttack.fillColor = color;
            }
        }
        else {
            this.leftCollideAttack.fillColor = 0xff0000;
            this.rightCollideAttack.fillColor = 0xff0000;
        }
    }

    #moveAnims_update() {
        // ATTACK
        if (this.cursors.space.isDown) {
            this.attack_mode = true;
            if (!this.sprite.anims.isPlaying || this.sprite.anims.getName() !== "player:attack") {
                this.sprite.anims.play("player:attack");
            }
        }

        if (!this.sprite.anims.isPlaying) {
            this.attack_mode = false;
        }

        if (!this.attack_mode) {
            // IDDLE
            if (this.cursors.up.isUp && this.cursors.down.isUp && this.cursors.left.isUp && this.cursors.right.isUp) {
                if (!this.sprite.anims.isPlaying || this.sprite.anims.getName() !== "player:iddle") {
                    this.sprite.anims.play("player:iddle");
                }
            }

            // RUN
            else if (this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown) {
                if (!this.sprite.anims.isPlaying || this.sprite.anims.getName() !== "player:run") {
                    this.sprite.anims.play("player:run");
                }
            }
        }

    }

    #movePos_update() { // check wall collide with foot
        if (!this.attack_mode) {
            if (this.cursors.left.isDown) {
                this.footCollide.x -= this.velocity;

                this.game.wall_collides[0].fillColor = 0xff0000;
                this.game.wall_collides[2].fillColor = 0xff0000;
                this.game.wall_collides[3].fillColor = 0xff0000;

                if (!Phaser.Geom.Intersects.RectangleToRectangle(this.game.wall_collides[1].getBounds(), this.footCollide.getBounds())) {
                    this.sprite.x -= this.velocity;
                    this.game.wall_collides[1].fillColor = 0xff0000;
                }

                else {
                    this.game.wall_collides[1].fillColor = 0xffff00;
                }

                this.footCollide.x += this.velocity;
            }
            else if (this.cursors.right.isDown) {
                this.footCollide.x += this.velocity;

                this.game.wall_collides[0].fillColor = 0xff0000;
                this.game.wall_collides[1].fillColor = 0xff0000;
                this.game.wall_collides[2].fillColor = 0xff0000;


                if (!Phaser.Geom.Intersects.RectangleToRectangle(this.game.wall_collides[3].getBounds(), this.footCollide.getBounds())) {
                    this.sprite.x += this.velocity;
                    this.game.wall_collides[3].fillColor = 0xff0000;
                }

                else {
                    this.game.wall_collides[3].fillColor = 0xffff00;
                }

                this.footCollide.x -= this.velocity;
            }
            if (this.cursors.up.isDown) {
                this.footCollide.y -= this.velocity;

                this.game.wall_collides[1].fillColor = 0xff0000;
                this.game.wall_collides[2].fillColor = 0xff0000;
                this.game.wall_collides[3].fillColor = 0xff0000;


                if (!Phaser.Geom.Intersects.RectangleToRectangle(this.game.wall_collides[0].getBounds(), this.footCollide.getBounds())) {
                    this.sprite.y -= this.velocity;
                    this.game.wall_collides[0].fillColor = 0xff0000;
                }

                else {
                    this.game.wall_collides[0].fillColor = 0xffff00;
                }

                this.footCollide.y += this.velocity;
            }
            else if (this.cursors.down.isDown) {
                this.footCollide.y += this.velocity;

                this.game.wall_collides[0].fillColor = 0xff0000;
                this.game.wall_collides[1].fillColor = 0xff0000;
                this.game.wall_collides[3].fillColor = 0xff0000;


                if (!Phaser.Geom.Intersects.RectangleToRectangle(this.game.wall_collides[2].getBounds(), this.footCollide.getBounds())) {
                    this.sprite.y += this.velocity;
                    this.game.wall_collides[2].fillColor = 0xff0000;
                }

                else {
                    this.game.wall_collides[2].fillColor = 0xffff00;
                }

                this.footCollide.y -= this.velocity;
            }
        }

    }

    #flipX_update() {
        if (this.cursors.left.isDown && !this.sprite.flipX && this.cursors.right.isUp) {
            this.sprite.flipX = true;
        }
        else if (this.cursors.right.isDown && this.sprite.flipX && this.cursors.left.isUp) {
            this.sprite.flipX = false;
        }
    }

    #health_update() {
        // check if game over for player else update health_bar
        if (this.health <= 0 && !this.isDeath) {
            this.isDeath = true;
            this.health_bar.setTexture("health_shield_bar", 11);

            this.sprite.anims.stop();
            this.sprite.anims.play("player:death");
    
        } else {
            let percent = (this.health * 100 / PLAYER['max_health']) / 100;
            this.health_bar.setTexture("health_shield_bar", Math.round(11 - (percent * 11)))
        }
    }

    experience_update() {
        const this_ = this;
        let idx = 0;

        for (let i of this.game.all_death_items) {
            if (this.game.physics.overlap(this.sprite, i) && i.active) { // if player take items
                i.setVisible(false);
                i.setActive(false);

                if (this.experienceFG.width >= 800 && !this.upgradeMode) {
                    this.experienceFG.width = 0;
                    this.upgradeMode = true;
        
                    // select 3 images index
                    const IMAGES = [];
                    for (let i=0; i<3; i++) {
                        IMAGES.push(UPGRADES[randint(0, UPGRADES.length-1)].img);
                    }
        
                    // create image
                    const screenWidth = this.game.game.config.width;
                    const screenHeight = this.game.game.config.height/2;
    
        
                    let UPDATE_IMAGE = [
                        this.game.add.sprite(200, screenHeight, "upgrade1", IMAGES[0]),
                        this.game.add.sprite(screenWidth/2, screenHeight, "upgrade1", IMAGES[1]),
                        this.game.add.sprite(screenWidth-200, screenHeight, "upgrade1", IMAGES[2]),
                    ];

                    for (let u of UPDATE_IMAGE) {
                        u.setScale(0).setDepth(200).setScrollFactor(0).setInteractive();
                        for (let idx of IMAGES) {
                            if (u.frame.name == idx) {
                                for (let u2 of UPGRADES) {
                                    if (u2.img == idx) {
                                        if (u2.levelMax <= 0) {
                                            u.setTint(0xff0000)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    this.closeBtn = this.game.add.image(this.game.game.config.width/2, this.game.game.config.height/2+200, "buttonUI", 52).setDepth(200).setScrollFactor(0).setOrigin(0.5, 0.5).setScale(0).setInteractive()

                    this.eventText.text = "";
                    
                    // UPGRADE EVENT
                    for (let i=0; i<UPDATE_IMAGE.length; i++) {
    
                        this.game.tweens.add({
                            targets: this.closeBtn,
                            duration: 500,
                            scale: 0.4,
                            ease: 'Elastic',
                            easeParams: [1.5, 0.5]
                        });

                        this.closeBtn.on("pointerover", () => {
                            this.closeBtn.setTint(0xcdcdcd);
                            setCursor("pointer");
                        });

                        this.closeBtn.on("pointerout", () => {
                            this.closeBtn.setTint(0xffffff);
                            setCursor("default");
                        });

                        this.closeBtn.on("pointerdown", () => {
                            if (!this.oneUpgradeClick) {
                                this.oneUpgradeClick = true;

                                this.game.tweens.add({
                                    targets: this.closeBtn,
                                    duration: 500,
                                    alpha: 0,
                                    angle: 360,
                                    ease: 'Power2',
                                });

                                setTimeout(() => {
                                    for (let i=0; i<UPDATE_IMAGE.length; i++) {
                                        this.game.tweens.add({
                                            targets: this.closeBtn,
                                            duration: 300,
                                            ease: "power2",
                                            scale: 0
                                        })

                                        this.game.tweens.add({
                                            targets: UPDATE_IMAGE[i],
                                            duration: 500,
                                            alpha: 0,
                                            ease: 'Power2',
                                            onComplete: () => {
                                                this.game.tweens.add({
                                                    targets: this.eventText,
                                                    alpha: 1,
                                                    duration: 300,
                                                    onComplete: () => {
                                                        this.game.tweens.add({
                                                            targets: this.eventText,
                                                            alpha: 0,
                                                            duration: 1000,
                                                        });
                                                        this.oneUpgradeClick = false;
                                                    }
                                                })
                                            }
                                        });
                                    }
                                    this.upgradeMode = false;
                                }, 1000)
                            }
                        });
                        
                        setTimeout(() => {
                            this.game.tweens.add({
                                targets: [UPDATE_IMAGE[i]],
                                duration: 500,
                                scale: this.updateIconScale,
                                ease: 'Elastic',
                                easeParams: [1.5, 0.5],
                                onComplete: () => {
                                    this.game.tweens.add({
                                        targets: this.game.bgMusic,
                                        volume: 0.25,
                                        duration: 50,
                                        onComplete: () => {
                                            this_.game.upgradeCardSound.play();
                                        }   
                                    })
                                }
                            });

                            UPDATE_IMAGE[i].on("pointerover", () => {
                                if (UPDATE_IMAGE[i].tintTopLeft != 0xff0000) {
                                    UPDATE_IMAGE[i].setTint(0xcdcdcd);
                                    setCursor("pointer");
                                }
                                
                            });

                            UPDATE_IMAGE[i].on("pointerout", () => {
                                if (UPDATE_IMAGE[i].tintTopRight != 0xff0000) {
                                    UPDATE_IMAGE[i].setTint(0xffffff);
                                    setCursor("default");
                                }
                            });

                            if (UPDATE_IMAGE[i].tintTopLeft != 0xff0000) {
                                UPDATE_IMAGE[i].on("pointerdown", () => {
                                    this.game.tweens.add({
                                        targets: this.game.bgMusic,
                                        volume: 0.75,
                                        duration: 200
                                    });
                                    if (!this.oneUpgradeClick) {

                                        this.oneUpgradeClick = true;

                                        this.game.tweens.add({
                                            targets: [UPDATE_IMAGE[i]],
                                            duration: 500,
                                            alpha: 0,
                                            angle: 360,
                                            ease: 'Power2',
                                        });
                                        
                                        for (let u of this.update) {
                                            if (u.img == Number(UPDATE_IMAGE[i].frame.name)) {
                                                u.levelMax -= 1
                                                
                                                switch (u.name) {
                                                    case "Resistance":
                                                        this.maxHealth += 50;
                                                        this.eventText.text = "+ 50 resistances";
                                                        break;
                                                    case "Faster movement":
                                                        this.velocity += 1;
                                                        this.runAnims.frameRate = this.velocity*4;
                                                        this.eventText.text = "+ 1 movement speeds";
                                                        break;
                                                    case "Faster attack":
                                                        this.attack_velocity += 1;
                                                        this.doubleAttackAnims.frameRate = this.attack_velocity*6;
                                                        this.eventText.text = "+ 1 attack speeds";
                                                        break;
                                                    case "Strength":
                                                        this.damage += 20;
                                                        this.eventText.text = "+ 20 damages";
                                                        break;
                                                    case "magnetic":
                                                        this.eventText.text = "NONE magnetic DEMO";
                                                        break;
                                                    case "Health":
                                                        if (this.health + 50 <= this.maxHealth) {
                                                            this.health += 50
                                                        }
                                                        else {
                                                            this.health = this.maxHealth;
                                                        }
                                                        this.eventText.text = "+ 50 lifes";
                                                        break;
                                                }
                                            }
                                        }
                                    
                                        setTimeout(() => {                                            
                                            for (let i=0; i<UPDATE_IMAGE.length; i++) {
                                                this.game.tweens.add({
                                                    targets: this.closeBtn,
                                                    duration: 300,
                                                    ease: "power2",
                                                    scale: 0
                                                })

                                                this.game.tweens.add({
                                                    targets: UPDATE_IMAGE[i],
                                                    duration: 500,
                                                    alpha: 0,
                                                    ease: 'Power2',
                                                    onComplete: () => {
                                                        this.game.tweens.add({
                                                            targets: this.eventText,
                                                            alpha: 1,
                                                            duration: 300,
                                                            onComplete: () => {
                                                                this.game.tweens.add({
                                                                    targets: this.eventText,
                                                                    alpha: 0,
                                                                    duration: 1000,
                                                                    onComplete: () => {
                                                                        this.game.bgMusic.setVolume(0.75);
                                                                    }
                                                                });

                                                                this.oneUpgradeClick = false;
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                            this.upgradeMode = false;
                                        }, 1000)
                                    }
                                });
                            }
                        }, 500 * i);
                    }
                }
                this.experienceFG.width += MONSTERS[i.data.get("type")]['xp'];
            }

            if (i.active && new Date() - i.data.get("time") > 20000) { // dispawn items after 20 sec
                i.destroy();
            }
            idx++;
        }
    }

    check_monster_collide(m) {
        this.sprite.setTint(0xffffff);

        if (!m.isDeath &&  m.distPlayer != -1 && m.distPlayer <= m.config['maxDistPlayer']) {
            this.sprite.setTint(0xff0000);
        }
    }
    
    loop() {
        if (!this.isDeath && !this.upgradeMode) {
            this.#moveAnims_update();
            this.#movePos_update();
            this.#attackRectCollide_update();
            this.#flipX_update();
            this.#footCollide_update();
            this.experience_update();
            this.#health_update();
        }
    }
}