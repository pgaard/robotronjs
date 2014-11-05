﻿var Robotron = Game.extend({

    init: function () {
        this._super("robotron", "canvas");
        this.score = 0;
        this.men = 2;
        this.innerWave = 1;
        this.gruntSpeed = 50; // + time * this.gruntSpeedRatio;
        this.bulletSpeed = 1000;
        this.spritesheet = new Image();
        this.spritesheet.src = 'images/robotronsprites.png';
        this.left = 20;
        this.right = this.width() - 20;
        this.top = 20;
        this.bottom = this.height() - 20;
        this.colors = {
            r: 255,
            g: 0,
            b: 0
        };
    },

    rgbColors: function () {
        return 'rgb(' + this.colors.r + ',' + this.colors.g + ',' + this.colors.b + ')';
    },

    initWave: function () {
        this.dead = 0;
        this.lastShotTime = 0;
        this.shootX = 0;
        this.shootY = 0;
        this.bonus = 1000;

        this.manSprite = new Man(game, this.middle().x, this.middle().y);

        if (this.continueWave) {
            this.addRandomSprites(this.currentWave["electrodes"], Electrode);
            this.addRandomSprites(this.currentWave["hulks"], Hulk);
            this.addRandomSprites(this.currentWave["grunts"], Grunt);
            this.addRandomSprites(this.currentWave["mommies"], Mommy);
            this.addRandomSprites(this.currentWave["daddies"], Daddy);
            this.addRandomSprites(this.currentWave["mikeys"], Mikey);
            this.addRandomSprites(this.currentWave["spheroids"] + Math.ceil(this.currentWave["enforcers"] / 4), Spheroid, true); // enforcers turn back into spheriods
            this.continueWave = 0;
        }
        else {
            this.addRandomSprites(Waves.getRoboCount(this.wave, "electrodes"), Electrode);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "hulks"), Hulk);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "grunts"), Grunt);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "mommies"), Mommy);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "daddies"), Daddy);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "mikeys"), Mikey);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "spheroids"), Spheroid, true);
        }
    },

    addRandomSprites: function (number, type, edge) {
        var buffer = 70,
            height = this.bottom - this.top - buffer,
            width = this.right - this.left - buffer;

        for (var i = 0; i < number; i++) {
            do {
                if (!edge) {
                    var left = Math.round(Math.random() * width) + this.left;
                    var t = Math.round(Math.random() * height) + this.top;
                }
                else {
                    // place on edge randomly
                    if (Math.random() < .5) {
                        if (Math.random() < .5) {
                            left = this.left + 10;
                        } else {
                            left = this.left + width;
                        }
                        t = Math.round(Math.random() * height) + this.top;
                    } else {
                        if (Math.random() < .5) {
                            t = this.top + 10;
                        } else {
                            t = this.top + height;
                        }
                        left = Math.round(Math.random() * width) + this.left;
                    }
                }

                var distance = this.distance(left, t, this.manSprite.left, this.manSprite.top);
            } while (distance < 150);

            new type(game, left, t);
        }
    },

    // override
    paintUnderSprites: function () {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.width(), this.height());
        this.rotateColors();
        this.context.strokeStyle = Waves.getBorderColor(this.wave);
        this.context.strokeRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
        this.context.fillStyle = this.rgbColors();
        this.context.font = "20px Courier";
        this.context.fillText(this.wave + 1 + " Wave", this.left + this.width() / 2 - 50, this.bottom + 16);
        this.context.fillText("Score: " + this.score + " men:" + this.men, this.left + 100, 15);

        if (this.gameOver) {
            this.context.fillStyle = "red";
            this.context.font = "40px Courier bold";
            this.context.fillText("GAME OVER", this.left + this.width() / 2 - 100, this.top + this.height() / 2);
        }
        else if (this.innerWave) {
            this.drawInnerWave();
        }
        else if (this.deathPause) {
            if (getTimeNow() - this.innerWaveTime > 1000) {
                this.deathPause = 0;
                this.startWave();
            }
        }
        ;
    },

    startWave: function (died) {
        if (!this.continueWave)
            this.wave++;
        this.removeAllSprites();
        this.playSound("sound_wavestart");
        this.innerWave = 1;
        this.innerWaveTime = getTimeNow();
    },

    drawInnerWave: function () {
        var progress = getTimeNow() - this.innerWaveTime;

        if (progress < 1000) {
            var percent = progress / 1000.0;
            var widthAdj = Math.round((1 - percent) * (this.right - this.left) / 2);
            var heightAdj = Math.round((1 - percent) * (this.bottom - this.top) / 2);
            this.context.fillStyle = this.rgbColors();
            this.context.fillRect(
                    this.left + widthAdj,
                    this.top + heightAdj,
                    (this.right - this.left) * percent,
                    (this.bottom - this.top) * percent);
        }
        else if (progress < 2000) {
            percent = (progress - 1000) / 1000.0;
            widthAdj = Math.round((1 - percent) * (this.right - this.left) / 2);
            heightAdj = Math.round((1 - percent) * (this.bottom - this.top) / 2);
            this.context.fillStyle = this.rgbColors();
            this.context.fillRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
            this.context.fillStyle = 'black';
            this.context.fillRect(
                    this.left + widthAdj,
                    this.top + heightAdj,
                    (this.right - this.left) * percent,
                    (this.bottom - this.top) * percent);
        }
        else {
            this.initWave();
            this.innerWave = 0;
            this.waveStartTime = getTimeNow();
        }
    },

    rotateColors: function () {
        this.colors.r += 7;
        if (this.colors.r > 255) this.colors.r = 0;
        this.colors.g += 4;
        if (this.colors.g > 255) this.colors.g = 0;
        this.colors.b += 3;
        if (this.colors.b > 255) this.colors.b = 0;
        this.context.lineWidth = 5;
    },

    // override
    startAnimate: function (time) {

        if (this.innerWave)
            return;
        this.handlesKeys();

        if (!this.innerWave &&
            this.getAllSprites(function (sprite) {
                    return sprite.mustKill == 1;
                }
            ).length == 0) {
            this.startWave();
            return;
        }

        this.gruntSpeed = 50 + (getTimeNow() - this.waveStartTime) * 0.004;
        this.shoot(time);
        this.checkForKills();
        this.checkForDeath();
    },

    handlesKeys: function () {
        var keys = this.pressedKeys;
        this.manSprite.setDirection(keys['a'], keys['d'], keys['w'], keys['s']);
        this.shootX = keys['l'] ? 1 : keys['j'] ? -1 : 0;
        this.shootY = keys['k'] ? 1 : keys['i'] ? -1 : 0;
    },

    shoot: function (time) {
        if ((this.shootX != 0 || this.shootY != 0) && !this.dead) {
            if (time - this.lastShotTime > 150) {

                // 4 bullet maximum
                if (this.getAllSprites('bullet').length < 4) {

                    // new bullet
                    this.lastShotTime = time;
                    this.playSound("sound_shot");
                    var bullet = new Bullet(
                        game,
                            this.manSprite.left + this.manSprite.width / 2,
                            this.manSprite.top + this.manSprite.height / 2,
                            this.shootX * this.bulletSpeed,
                            this.shootY * this.bulletSpeed
                    );
                }
            }
        }
    },

    increaseScore: function (amount) {

        if (Math.round((this.score + amount) / 25000) > Math.round(this.score / 25000))
            this.men++;
        this.score += amount;
    },

    checkForKills: function () {
        var sprites = this.getAllSprites();
        var bullets = this.getAllSprites('bullet');
        for (var b in bullets) {
            var bullet = bullets[b];
            for (var i in sprites) {
                var enemy = sprites[i];

                if (!(enemy.kill))
                    continue;

                if (bullet.left >= enemy.left && bullet.left <= enemy.left + enemy.width &&
                    bullet.top >= enemy.top && bullet.top <= enemy.top + enemy.height) {

                    enemy.kill(bullet);
                    if (enemy.score)
                        this.increaseScore(enemy.score);
                    this.removeSprite(bullet);
                    break;
                }
            }
        }
    },

    getSpriteCounts: function () {
        return {
            electrodes: this.getSpriteCount("electrode"),
            hulks: this.getSpriteCount("hulk"),
            grunts: this.getSpriteCount("grunt"),
            mommies: this.getSpriteCount("mommy"),
            daddies: this.getSpriteCount("daddy"),
            mikeys: this.getSpriteCount("mikey"),
            spheroids: this.getSpriteCount("spheroid"),
            enforcers: this.getSpriteCount("enforcer")
        };
    },

    checkForDeath: function () {
        if (!this.paused && this.manSprite.direction && !this.dead) {
            // check for death
            var sprites = this.getAllSprites();
            var left = this.manSprite.left;
            var top = this.manSprite.top;
            var width = this.manSprite.cells[this.manSprite.direction][0].w * 2;
            var height = this.manSprite.cells[this.manSprite.direction][0].h * 2;
            var removeSprites = [];
            var addSprites = [];
            for (var i = 0; i < sprites.length; i++) {
                var sprite = sprites[i];
                if (sprite.enemy &&
                    (left + width) >= sprite.left && left <= sprite.left + sprite.width &&
                    (top + height) >= sprite.top && top <= sprite.top + sprite.height) {

                    // dead
                    this.playSound("sound_death");
                    this.dead = 1;
                    // TODO: remove bullet and explosion sprites, make man flash
                    if (this.men > 0) {
                        this.men--;
                        this.continueWave = 1;
                        this.currentWave = this.getSpriteCounts();
                        this.deathPause = 1;
                        this.innerWaveTime = getTimeNow();
                    } else {
                        // game over
                        this.gameOver = 1;
                    }
                }
                // TODO: repeated collision check
                else if (sprite instanceof Family &&
                    (left + width) >= sprite.left && left <= sprite.left + sprite.width &&
                    (top + height) >= sprite.top && top <= sprite.top + sprite.height) {

                    // points
                    this.increaseScore(this.bonus);
                    addSprites.push(new Bonus(game, sprite.left, sprite.top, this.bonus));
                    this.playSound("sound_rescue");

                    if (this.bonus < 5000)
                        this.bonus += 1000;
                    removeSprites.push(sprite);

                }
            }

            for (i in removeSprites)
                this.removeSprite(removeSprites[i]);

            for (i in addSprites)
                this.addSprite(addSprites[i]);
        }
    }
});

var game = new Robotron();

game.addKeyListener(
    {
        key: 'p',
        listener: function (pressed) {
            if (pressed) {
                //this.wave = -1;
                game.wave = -1;
                game.paused = 0;
                game.startWave();
                game.start();
            }
        }
    }
);
