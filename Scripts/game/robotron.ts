class Robotron extends Game{
    men: number;
    wave: number;
    innerWave: boolean;
    startingWave: number = 5;
    currentWave: { [id: string]: number; };
    continueWave: boolean;
    gameOver: boolean;
    colors: {r:number; g:number; b:number};
    lastShotTime: number;
    waveStartTime: number;
    innerWaveTime: number;
    shootX: number;
    shootY: number;
    bonus: number;
    manSprite: Man;
    deathPause: boolean;

    constructor() {
        super("robotron", "canvas");
        this.score = 0;
        this.men = 4;
        this.innerWave = true;
        this.spritesheet = new Image();
        this.spritesheet.src = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + '/images/robotronsprites.png';
        this.left = 20;
        this.right = this.width() - 20;
        this.top = 35;
        this.bottom = this.height() - 22;
        this.colors = {
            r: 255,
            g: 0,
            b: 0
        };

        RobotronSprite.getMan = () => this.manSprite;
        RobotronSprite.rgbColors = () => this.rgbColors();
    }

    rgbColors() {
        return 'rgb(' + this.colors.r + ',' + this.colors.g + ',' + this.colors.b + ')';
    }

    initWave() {
        this.dead = false;
        this.lastShotTime = 0;
        this.shootX = 0;
        this.shootY = 0;
        this.bonus = 1000;

        this.manSprite = new Man(this, this.middle().x, this.middle().y);

        if (this.continueWave) {
            this.addRandomSprites(this.currentWave["electrodes"], Electrode);
            this.addRandomSprites(this.currentWave["hulks"], Hulk);
            this.addRandomSprites(this.currentWave["grunts"], Grunt);
            this.addRandomSprites(this.currentWave["mommies"], Mommy);
            this.addRandomSprites(this.currentWave["daddies"], Daddy);
            this.addRandomSprites(this.currentWave["mikeys"], Mikey);
            this.addRandomSprites(this.currentWave["spheroids"] + Math.ceil(this.currentWave["enforcers"] / Spheroid.enforcersSpawned), Spheroid, true); // enforcers turn back into spheriods
            this.addRandomSprites(this.currentWave["brains"], Brain);
            this.addRandomSprites(this.currentWave["quarks"], Quark, true);
            this.addRandomSprites(this.currentWave["tanks"], Tank);
            this.continueWave = false;
        }
        else {
            this.addRandomSprites(Waves.getRoboCount(this.wave, "electrodes"), Electrode);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "hulks"), Hulk);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "grunts"), Grunt);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "mommies"), Mommy);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "daddies"), Daddy);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "mikeys"), Mikey);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "spheroids"), Spheroid, true);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "brains"), Brain);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "quarks"), Quark, true);
            this.addRandomSprites(Waves.getRoboCount(this.wave, "tanks"), Tank, true);
        }
    }

    addRandomSprites(number: number, type: any, edge? : boolean) {
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

            if (type == Grunt)
                new Grunt(this, left, t, () => this.waveDuration(), () => this.manLocation());
            else if (type == Brain)
                new Brain(this, left, t, () => this.manLocation(), () => this.rgbColors());
            else if(type == Electrode)
                new Electrode(this, left, t, () => this.rgbColors());
            else if (type == Quark)
                new Quark(this, left, t, () => this.rgbColors());
            else if (type == Tank)
                new Tank(this, left, t, () => this.rgbColors());
            else
                new type(this, left, t);
        }
    }

    manLocation() {
        return {
            top: this.manSprite.top,
            left: this.manSprite.left
        };
    }

    // override
    paintUnderSprites() {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.width(), this.height());
        this.rotateColors();
    }

    // override
    paintOverSprites() {
       
        var textWriter = new TextWriter(this.context, this.spritesheet);
        textWriter.write(this.wave + 1 + " wave", this.left + this.width() / 2 - 50, this.bottom + 6, 1);
        textWriter.write(this.score + "  " + Array(this.men).join("!"), this.left + 100, 5, 2);

        if (this.gameOver) {
            textWriter.write("game over", this.left + ((this.right - this.left) / 2) - (36*8+18)/2, this.top + (this.bottom - this.top) / 2 - (36/2), 3);
        }

        else if (this.innerWave) {
            this.drawInnerWave();
        }
        else if (this.deathPause) {
            if (getTimeNow() - this.innerWaveTime > 1000) {
                this.deathPause = false;
                this.startWave();
            }
        };

        var borderColor = Waves.getBorderColor(this.wave);
        this.context.strokeStyle = borderColor == 'rotate' ? this.rgbColors() : borderColor;
        this.context.strokeRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
        this.context.fillStyle = this.rgbColors();
    }

    startWave() {
        if (!this.continueWave)
            this.wave++;
        this.removeAllSprites();
        this.playSound("sound_wavestart");
        this.innerWave = true;
        this.innerWaveTime = getTimeNow();
    }

    drawInnerWave() {
        var progress = getTimeNow() - this.innerWaveTime;
        var drawTime = 800;
        var width = this.right - this.left;
        var height = this.bottom - this.top;
        var widthAdj = (percent: number) => Math.round((1 - percent) * width/ 2);
        var heightAdj = (percent: number) => Math.round((1 - percent) * height / 2);        

        if (progress < drawTime) {
            var percent = progress / drawTime;
            this.context.fillStyle = this.rgbColors();
            this.context.fillRect(this.left + widthAdj(percent), this.top + heightAdj(percent), width * percent,height * percent);

            this.context.strokeStyle = 'black';
            this.context.lineWidth = 5;
            for (var p = 0; p < percent; p += .025) {
                this.context.strokeRect(this.left + widthAdj(p), this.top + heightAdj(p), width * p, height * p);
            } 
        }
        else if (progress < drawTime * 2) {
            percent = (progress - drawTime) / drawTime;
            this.context.fillStyle = this.rgbColors();
            this.context.fillRect(this.left, this.top, width, height);

            this.context.fillStyle = 'black';
            this.context.fillRect(this.left + widthAdj(percent), this.top + heightAdj(percent), width * percent, height * percent);

            this.context.strokeStyle = 'black';
            this.context.lineWidth = 5;
            for (var p = 1; p > percent; p -= .025) {
                this.context.strokeRect(this.left + widthAdj(p), this.top + heightAdj(p), width * p, height * p);
            } 
        }
        else {
            this.initWave();
            this.innerWave = false;
            this.waveStartTime = getTimeNow();
        }
    }

    rotateColors() {
        this.colors.r += 7;
        if (this.colors.r > 255) this.colors.r = 0;
        this.colors.g += 4;
        if (this.colors.g > 255) this.colors.g = 0;
        this.colors.b += 3;
        if (this.colors.b > 255) this.colors.b = 0;
        this.context.lineWidth = 5;
    }

    waveDuration() {
        return (getTimeNow() - this.waveStartTime);
    }

    // override
    startAnimate(time: number) {

        RobotronSprite.currentTime = getTimeNow();

        if (this.innerWave)
            return;
        this.handlesKeys();

        if (!this.innerWave &&
            this.getAllSprites(function (sprite: RobotronSprite) {
                    return sprite.mustKill == true;
                }
            ).length == 0) {
            this.startWave();
            return;
        }        
     
        this.shoot(time);
        this.checkForKills();
        this.checkForDeath();
        this.checkForEndOfWave();
    }

    handlesKeys() {
        var keys = this.pressedKeys;
        this.manSprite.setDirection(keys['a'], keys['d'], keys['w'], keys['s']);
        this.shootX = keys['l'] ? 1 : keys['j'] ? -1 : 0;
        this.shootY = keys['k'] ? 1 : keys['i'] ? -1 : 0;
    }

    checkForEndOfWave() {
        if (!this.innerWave &&
            this.getAllSprites((sprite: RobotronSprite) => { return sprite.mustKill == true }).length == 0) {
                this.startWave();
                return true;
        }     
        return false;
    }

    shoot(time: number) {
        if ((this.shootX != 0 || this.shootY != 0) && !this.dead) {
            if (time - this.lastShotTime > 150) {

                // 4 bullet maximum
                if (this.getAllSprites('bullet').length < 4) {

                    // new bullet
                    this.lastShotTime = time;
                    this.playSound("sound_shot");
                    var bullet = new Bullet(
                        this,
                            this.manSprite.left + this.manSprite.width / 2,
                            this.manSprite.top + this.manSprite.height / 2,
                            this.shootX,
                            this.shootY,
                            () => this.rgbColors()
                    );
                }
            }
        }
    }

    increaseScore(amount: number) {

        if (Math.floor((this.score + amount) / 25000) > Math.floor(this.score / 25000))
            this.men++;
        this.score += amount;
    }

    checkForKills() {
        var sprites = this.getAllSprites();
        var bullets = this.getAllSprites('bullet');
        for (var b in bullets) {
            var bullet = <Bullet>bullets[b];
            for (var i in sprites) {
                var enemy = <RobotronSprite>sprites[i];

                if (!enemy.canKill)
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
    }

    getSpriteCounts(): { [id: string]: number; } {
        return {
            electrodes: this.getSpriteCount("electrode"),
            hulks: this.getSpriteCount("hulk"),
            grunts: this.getSpriteCount("grunt"),
            mommies: this.getSpriteCount("mommy"),
            daddies: this.getSpriteCount("daddy"),
            mikeys: this.getSpriteCount("mikey"),
            spheroids: this.getSpriteCount("spheroid"),
            enforcers: this.getSpriteCount("enforcer"),
            brains: this.getSpriteCount("brain"),
            quarks: this.getSpriteCount("quark"),
            tanks: this.getSpriteCount("tank")
        };
    }

    checkForDeath() {
        if (!this.paused && this.manSprite.direction && !this.dead) {
            // check for death
            var sprites = this.getAllSprites();
            var hulks = this.getAllSprites('hulk');
            var left = this.manSprite.left;
            var top = this.manSprite.top;
            var width = Man.cells[this.manSprite.direction][0].w * 2;
            var height = Man.cells[this.manSprite.direction][0].h * 2;
            var removeSprites: Sprite[] = [];
            var addSprites: Sprite[] = [];
            for (var i = 0; i < sprites.length; i++) {
                var sprite = sprites[i];
                if (sprite.enemy &&
                    (left + width) >= sprite.left && left <= sprite.left + sprite.width &&
                    (top + height) >= sprite.top && top <= sprite.top + sprite.height) {

                    // dead
                    this.playSound("sound_death");
                    this.dead = true;
                    // TODO: remove bullet and explosion sprites, make man flash
                    this.men--;
                    if (this.men > 0) {
                        this.continueWave = true;
                        this.currentWave = this.getSpriteCounts();
                        this.deathPause = true;
                        this.innerWaveTime = getTimeNow();
                    } else {
                        // game over
                        this.gameOver = true;
                    }
                }
                // TODO: repeated collision check
                else if (sprite instanceof Family){
                    if((left + width) >= sprite.left && left <= sprite.left + sprite.width &&
                        (top + height) >= sprite.top && top <= sprite.top + sprite.height)
                    {
                        // points
                        this.increaseScore(this.bonus);
                        addSprites.push(new Bonus(this, sprite.left, sprite.top, this.bonus.toString()));
                        this.playSound("sound_rescue");

                        if (this.bonus < 5000)
                            this.bonus += 1000;
                        removeSprites.push(sprite);
                    }
                    else
                    {
                        // also check for family kills by hulks
                        for(var h=0; h<hulks.length;h++){
                            var hulk = hulks[h];
                            if((hulk.left + hulk.width) >= sprite.left && hulk.left <= sprite.left + sprite.width &&
                                (hulk.top + hulk.height) >= sprite.top && hulk.top <= sprite.top + sprite.height){
                                removeSprites.push(sprite);
                                addSprites.push(new Skull(this, sprite.left, sprite.top ));
                                this.playSound("sound_familydie");
                            }
                        }
                    }
                }
            }

            for (var j in removeSprites)
                this.removeSprite(removeSprites[j]);

            for (var j in addSprites)
                this.addSprite(addSprites[j]);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    var game = new Robotron();

    game.wave = game.startingWave - 2;
    game.paused = false;
    game.startWave();
    game.start();

    game.addKeyListener(
        {
            key: 'p',
            listener: (pressed: boolean) => {
                if (pressed) {
                    game.paused = !game.paused;
                }
            }
        }
        );
});
