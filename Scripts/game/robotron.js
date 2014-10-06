var game = new Game("testgame", "canvas");

game.score = 0;
game.men = 2;
game.keys = [];
game.innerWave = 1;
game.gruntSpeedRatio = 0.002;
game.gruntSpeed = 50; // + time * game.gruntSpeedRatio;
game.manSpeed = 100;
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
game.rgbColors = function (){
    return 'rgb(' + game.colors.r + ',' + game.colors.g + ',' + game.colors.b + ')';
}

game.initWave = function () {
    game.dead = 0;
    game.lastShotTime = 0;
    game.shootX = 0;
    game.shootY = 0;
    game.bonus = 1000;

    game.manSprite = new Man(game, game.middle().x, game.middle().y);

    if (game.continueWave) {
        game.addRandomSprites(this.currentWave["electrodes"], Electrode);
        game.addRandomSprites(this.currentWave["hulks"], Hulk);
        game.addRandomSprites(this.currentWave["grunts"], Grunt);
        game.addRandomSprites(this.currentWave["mommies"], Mommy);
        game.addRandomSprites(this.currentWave["daddies"], Daddy);
        game.addRandomSprites(this.currentWave["mikeys"], Mikey);
        game.continueWave = 0;
    }
    else {
        game.addRandomSprites(Waves.getRoboCount(game.wave, "electrodes"), Electrode);
        game.addRandomSprites(Waves.getRoboCount(game.wave, "hulks"), Hulk);
        game.addRandomSprites(Waves.getRoboCount(game.wave, "grunts"), Grunt);
        game.addRandomSprites(Waves.getRoboCount(game.wave, "mommies"), Mommy);
        game.addRandomSprites(Waves.getRoboCount(game.wave, "daddies"), Daddy);
        game.addRandomSprites(Waves.getRoboCount(game.wave, "mikeys"), Mikey);
    }
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
    this.context.strokeStyle =  Waves.getBorderColor(this.wave);
    this.context.strokeRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
    this.context.fillStyle = this.rgbColors();
    this.context.font = "20px Courier";
    this.context.fillText(this.wave + 1 + " Wave", this.left + this.width() / 2 - 50, this.bottom + 16);
    this.context.fillText("Score: " + this.score + " men:" + this.men , this.left + 100, 15);

    if(this.gameOver){
        this.context.fillStyle = "red";
        this.context.font = "40px Courier bold";
        this.context.fillText("GAME OVER", this.left + this.width() / 2 - 100, this.top  + this.height() / 2);
    }
    else if (game.innerWave) {
        game.drawInnerWave();
    }
    else if (game.deathPause){
        if(getTimeNow() - game.innerWaveTime > 1000) {
            game.deathPause = 0;
            this.startWave();
        }
    };
};

game.startWave = function (died) {
    if(!game.continueWave)
        game.wave++;
    game.removeAllSprites();
    game.playSound("sound_wavestart");
    game.innerWave = 1;
    game.innerWaveTime = getTimeNow();
};

game.drawInnerWave = function () {
    var progress = getTimeNow() - game.innerWaveTime;

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
};

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
game.getSpriteCounts = function(){
    return {
        electrodes : game.getSpriteCount("electrode"),
        hulks : game.getSpriteCount("hulk"),
        grunts : game.getSpriteCount("grunt"),
        mommies: game.getSpriteCount("mommy"),
        daddies: game.getSpriteCount("daddy"),
        mikeys: game.getSpriteCount("mikey")
    };
};

game.checkForDeath = function() {
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
            if ((sprite instanceof Grunt || sprite instanceof Hulk || sprite instanceof Electrode)  &&
                (left + width) >= sprite.left && left <= sprite.left + sprite.width &&
                (top + height) >= sprite.top && top <= sprite.top + sprite.height) {

                // dead
                this.playSound("sound_death");
                this.dead = 1;
                // TODO: remove bullet and explosion sprites, make man flash
                if(this.men > 0){
                    this.men--;
                    this.continueWave = 1;
                    this.currentWave = this.getSpriteCounts();
                    this.deathPause = 1;
                    this.innerWaveTime = getTimeNow();
                } else{
                    // game over
                    this.gameOver = 1;
                }
            }
            // TODO: repeated collision check
            else if(sprite instanceof Family &&
                (left + width) >= sprite.left && left <= sprite.left + sprite.width &&
                (top + height) >= sprite.top && top <= sprite.top + sprite.height){

                // points
                this.increaseScore(this.bonus);
                addSprites.push(new Bonus(game, sprite.left, sprite.top, this.bonus ));
                this.playSound("sound_rescue");

                if(this.bonus < 5000)
                    this.bonus += 1000;
                removeSprites.push(sprite);

            }
        }

        for(i in removeSprites)
            game.removeSprite(removeSprites[i]);

        for(i in addSprites)
            game.addSprite(addSprites[i]);
    }
};

game.increaseScore = function(amount){

    if(Math.round((this.score + amount) / 25000) > Math.round(this.score / 25000))
        this.men++;
    this.score += amount;
},

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
