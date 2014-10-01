var game = new Game("testgame", "canvas");

game.score = 0;
game.keys = [];
game.innerWave = 1;
game.gruntSpeedRatio = 0.002;
game.gruntSpeed = 50; // + time * game.gruntSpeedRatio;
game.manSpeed = 200;
game.bulletSpeed = 750;
game.spritesheet = new Image();
game.spritesheet.src = 'images/robotronsprites.png';
game.left = 20;
game.right = game.width() - 20;
game.top = 20;
game.bottom = game.height() - 20;
game.colors = {
    r: 255,
    g: 0,
    b: 0
};

game.initWave = function () {
    game.dead = 0;
    game.lastShotTime = 0;
    game.shootX = 0;
    game.shootY = 0;

    game.manSprite = new Man(game, game.middle().x, game.middle().y);

    game.addRandomSprites(Waves.getRoboCount(game.wave, "electrodes"), Electrode);
    game.addRandomSprites(Waves.getRoboCount(game.wave, "hulks"), Hulk);
    game.addRandomSprites(Waves.getRoboCount(game.wave, "grunts"), Grunt);
    game.addRandomSprites(Waves.getRoboCount(game.wave, "mommies"), Mommy);
};

game.addRandomSprites = function(number, type) {
    var buffer = 100,
        height = this.height() - buffer,
        width = this.width() - buffer;

    for (var i = 0; i < number; i++) {
        do {
            var left = Math.round(Math.random() * width) + game.left;
            var t = Math.round(Math.random() * height) + game.top;
            var distance = game.distance(left, t, game.manSprite.left, game.manSprite.top);
        } while (distance < 150);
        new type(game, left, t);
    }
};

game.paintUnderSprites = function () {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.width(), this.height());
    this.rotateColors();
    this.context.strokeStyle = 'rgb(' + game.colors.r + ',' + game.colors.g + ',' + game.colors.b + ')';
    this.context.strokeRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
    this.context.fillStyle = this.context.strokeStyle;
    this.context.font = "20px Courier";
    this.context.fillText(this.wave + 1 + " Wave", this.left + this.width() / 2 - 50, this.bottom + 16);
    this.context.fillText("Score: " + this.score, this.left + 100, 15);
    if (game.innerWave) {
        game.drawInnerWave();
    }
};

game.startWave = function () {
    game.wave++;
    game.removeAllSprites();
    game.playSound("sound_wavestart");
    game.innerWave = 1;
    game.innerWaveTime = getTimeNow();
},

game.drawInnerWave = function () {
    var progress = getTimeNow() - game.innerWaveTime;

    if (progress < 1000) {
        var percent = progress / 1000.0;
        var widthAdj = Math.round((1 - percent) * (this.right - this.left) / 2);
        var heightAdj = Math.round((1 - percent) * (this.bottom - this.top) / 2);
        this.context.fillStyle = 'rgb(' + game.colors.r + ',' + game.colors.g + ',' + game.colors.b + ')';
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
        this.context.fillStyle = 'rgb(' + game.colors.r + ',' + game.colors.g + ',' + game.colors.b + ')';
        this.context.fillRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
        this.context.fillStyle = 'black';
        this.context.fillRect(
            this.left + widthAdj,
            this.top + heightAdj,
            (this.right - this.left) * percent,
            (this.bottom - this.top) * percent);
    }
    else {
        game.initWave();
        game.innerWave = 0;        
        game.waveStartTime = getTimeNow();
    }
};

game.rotateColors = function () {
    game.colors.r += 7;
    if (game.colors.r > 255) game.colors.r = 0;
    game.colors.g += 4;
    if (game.colors.g > 255) game.colors.g = 0;
    game.colors.b += 3;
    if (game.colors.b > 255) game.colors.b = 0;
    this.context.lineWidth = 5;
},

game.startAnimate = function (time) {

    if (game.innerWave)
        return;

    game.handlesKeys();

    if (!game.innerWave && game.getAllSprites("grunt").length == 0) {
        this.startWave();
        return;
    }

    game.gruntSpeed = 50 + (getTimeNow() - game.waveStartTime) * 0.004;

    this.shoot(time);

    this.checkForDeath();
};

game.handlesKeys = function () {
    var speed = this.manSpeed;
    var keys = this.pressedKeys;
    this.manSprite.velocityX = keys['d'] ? speed : keys['a'] ? -speed : 0;
    this.manSprite.velocityY = keys['s'] ? speed : keys['w'] ? -speed : 0;
    this.shootX = keys['l'] ? 1 : keys['j'] ? -1 : 0;
    this.shootY = keys['k'] ? 1 : keys['i'] ? -1 : 0;
};

game.shoot = function(time) {
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
};

game.checkForDeath = function() {
    if (!this.paused && this.manSprite.direction && !this.dead) {
        // check for death
        var grunts = this.getAllSprites();
        var left = this.manSprite.left;
        var top = this.manSprite.top;
        var width = this.manSprite.cells[this.manSprite.direction][0].w * 2;
        var height = this.manSprite.cells[this.manSprite.direction][0].h * 2;
        for (var i = 0; i < grunts.length; i++) {
            if (grunts[i].name != 'man' && grunts[i].name != 'bullet' && grunts[i].name != 'explosion' &&
                (left + width) >= grunts[i].left && left <= grunts[i].left + grunts[i].width &&
                (top + height) >= grunts[i].top && top <= grunts[i].top + grunts[i].height) {

                // dead
                this.playSound("sound_death");
                this.dead = 1;
            }
        }
    }
};

game.addKeyListener(
    {
        key: 'p',
        listener: function (pressed) {
            if (pressed) {
                game.wave = -1;
                game.paused = 0;
                game.startWave();       
                game.start();
            }
        }
    }
);
