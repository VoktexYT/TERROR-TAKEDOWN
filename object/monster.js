class Monster {
    constructor(game, type) {
        /**
         * @type {Start}
         */
        this.game = game;

        this.type = type;
        this.config = MONSTERS[type];

        this.health = this.config['health']

        // properties
        this.isDeath = false;
        this.distPlayer = -1;
        this.monsterAttackAnimsFrameProgressDamage = 0;
        this.isAttack = false;
        this.i = 0;
    }

    start() {   
        this.sprite = this.game.add.sprite(randint(0, 1344), randint(0, 1920), this.config["key"], 0);
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setScale(this.config["scale"]);

        this.game.physics.add.existing(this.sprite);
        this.sprite.body.setSize(10, 10);

        this.collide = this.game.add.rectangle(0, 0, this.config["frameSize"][0] * this.sprite.scale, this.config["frameSize"][1] * this.sprite.scale, 0x0000ff).setVisible(false);

        if (this.type == "slime") {
            this.collide.width = this.config["frameSize"][0] * this.sprite.scale - 90;
            this.collide.height = this.config["frameSize"][1] * this.sprite.scale - 60;
        }

        if (DEBUG['attack']) {
            this.collide.setVisible(true);
        }

        this.sprite.anims.play(`monster:${this.type}:move`);

        // create ray list if monster_rays is true
        if (DEBUG['monster_rays']) {
            this.game.lines.push(this.game.add.line(0, 0, 0, 0, 0, 0, 0xff00ff, 1));
        }
    }

    loop() { // 0 == Right, 2 == Left
        if (!this.isDeath) {
            this.#position_update();
            this.#checkCollide_update();
            this.#attackAnimation_update();
        }
    }

    #getDamege(flipX) {
        this.sprite.setTint(0xff0000);

        // if alive
        if ((this.health - this.game.player.damage) > 0) {
            this.game.tweens.add({
                targets: this.sprite,
                x: this.sprite.x + flipX * randint(100, 200),
                duration: 300,
                onComplete: () => {
                    this.sprite.setTint(0xffffff);
                    this.health -= this.game.player.damage;
                }
            });
        }

        // if death
        else if (this.sprite.active && !this.isDeath){
            this.isDeath = true;

            this.game.tweens.add({
                targets: this.sprite,
                x: this.sprite.x + flipX * randint(100, 200),
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.sprite.destroy();

                    let item = this.game.add.sprite(this.sprite.x, this.sprite.y, this.type + ":item_image");
                    item.setAlpha(0);
                    item.setScale(this.config['loot_scale'])

                    this.game.tweens.add({
                        targets: item,
                        alpha: 1,
                        duration: 300,
                        onComplete: () => {
                            this.game.physics.add.existing(item);
                            item.body.setSize(400, 400)
                            item.setData({time: new Date(), type: this.type});
                            this.game.all_death_items.push(item)

                            this.game.tweens.add({
                                targets: item,
                                alpha: 0,
                                duration: 20000
                            })
                        }
                    })
                }
            });
        }
    }

    #position_update() {
        let dirrX = 0;
        let dirrY = 0;

        // Distance with player to monster √ (x2 - x1) ^ 2 + (y2 - y1) ^ 2
        const x1 = this.sprite.x;
        let y1 = this.sprite.y;
        const x2 = this.game.player.footCollide.x;
        let y2 = this.game.player.footCollide.y-20;

        if (y1 < y2) {
            this.sprite.setDepth(0);
            if (this.type == "slime") {
                y1 += 80;
            }
        } else if (y1 > y2) {
            this.sprite.setDepth(2);
            if (this.type == "slime") {
                y1 += 20;
            }
        }

        this.distPlayer = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)));

        // update sprite position (Follow player)
        if (x1 != x2 && this.distPlayer > this.config["maxDistPlayer"]) {
            dirrX = ((x2 - x1) / Math.abs(x2 - x1)) * this.config["velocity"];
            this.sprite.x += dirrX; 
        }
        if (y1 != y2 && this.distPlayer > this.config["maxDistPlayer"]) {
            dirrY = ((y2 - y1) / Math.abs(y2 - y1)) * this.config["velocity"];
            this.sprite.y += dirrY;
        }

        // flipX monster when he's to left or right
        if (dirrX != 0) {
            this.sprite.flipX = (1 - (dirrX / Math.abs(dirrX)))
        }

        this.collide.x = this.sprite.x; 
        this.collide.y = this.sprite.y;

        if (this.type == "slime") {
            this.collide.x = this.sprite.x+40; 
            this.collide.y = this.sprite.y+60;
        }
        
    }

    #checkCollide_update() {
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.collide.getBounds(), this.game.player.leftCollideAttack.getBounds())) {
            if (DEBUG['attack']) {
                console.log("monster is in player attack zone");
            }

            if (this.game.player.leftCollideAttack.fillColor == 0xffff00) {
                this.#getDamege(-1) // (-1) slide direction
            }
        }

        else if (Phaser.Geom.Intersects.RectangleToRectangle(this.collide.getBounds(), this.game.player.rightCollideAttack.getBounds())) {
            if (DEBUG['attack']) {
                console.log("monster is in player attack zone");
            }

            if (this.game.player.rightCollideAttack.fillColor == 0xffff00) {
                this.#getDamege(1) // (1) slide direction
            }
        }
    }

    #attackAnimation_update() {
        if (this.distPlayer <= this.config["maxDistPlayer"]) {
            if (this.sprite.anims.getName() != `monster:${this.type}:attack`) {
                this.sprite.anims.stop();
                this.sprite.anims.play(`monster:${this.type}:attack`);
            }
            else if (this.sprite.anims.getProgress() == 1) {
                this.sprite.anims.play(`monster:${this.type}:attack`);
                this.AfterAttackPlayerPosition = [this.game.player.sprite.x, this.game.player.sprite.y];
                this.isAttack = false;
            }

            if (this.sprite.anims.getName() == `monster:${this.type}:attack` && this.sprite.anims.getProgress() == this.monsterAttackAnimsFrameProgressDamage && !this.isAttack) {
                if (this.distPlayer <= this.config["maxDistPlayer"]) {
                    this.isAttack = true;
                    this.game.player.health -= this.config["damage"];
                } 
            }
        }

        else {
            if (this.sprite.anims.getName() != `monster:${this.type}:move`) {
                this.sprite.anims.stop();
                this.sprite.anims.play(`monster:${this.type}:move`);
            }
        }
    }
}