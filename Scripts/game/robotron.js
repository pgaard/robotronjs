var game = new Game("testgame", "canvas");

game.innerWave = 1;
game.gruntNumber = 15;
game.hulkNumber = 5;
game.gruntSpeedRatio = 0.002;
game.gruntSpeed = 50; // + time * game.gruntSpeedRatio;
game.manSpeed = 200;
game.bulletSpeed = 750;
game.spritesheet = new Image();
game.spritesheet.src = 'file:///F:/mygames/robotron-js/images/robotronsprites.png';
game.left = 20;
game.right = game.width() - 20;
game.top = 20;
game.bottom = game.height() - 20;
game.colors = {
    r: 255,
    g: 0,
    b: 0
};

game.init = function() {
    game.dead = 0;
    game.lastShotTime = 0;
    game.shootX = 0;
    game.shootY = 0;
  
    game.manSprite = new Man(game, game.middle().x, game.middle().y);
    
    for (i=0; i < game.hulkNumber; i++) {        
        do {
            left = Math.round(Math.random() * (game.right - game.left)) + game.left;
            t = Math.round(Math.random() * (game.bottom - game.top)) + game.top;
            distance = game.distance(left, t, game.manSprite.left, game.manSprite.top);
        }  
        while (distance < 150);
        var hulk = new Hulk(game, left, t);    
    }     
    
    for (var i=0; i < game.gruntNumber; i++) {
        var left, t;
        do {
            left = Math.round(Math.random() * (game.right - game.left)) + game.left;
            t = Math.round(Math.random() * (game.bottom - game.top)) + game.top;
            var distance = game.distance(left, t, game.manSprite.left, game.manSprite.top);
        }  
        while (distance < 300);
        var gruntSprite = new Grunt(game, left, t);    
    }        
};

game.paintUnderSprites = function() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.width(), this.height());
    game.rotateColors();    
    this.context.strokeStyle = 'rgb(' + game.colors.r + ',' + game.colors.g + ',' + game.colors.b + ')';      
    this.context.strokeRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
    
    if (game.innerWave) {
        game.drawInnerWave();
    }        
};

game.startWave = function()
{
    game.removeAllSprites();
    game.playSound("sound_wavestart");
    game.innerWave = 1;
    game.innerWaveTime = getTimeNow();
},

game.drawInnerWave = function() {
    var progress = getTimeNow() - game.innerWaveTime;

    if(progress < 1000)
    {
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
        game.innerWave = 0;
        game.init();
    }
};

game.rotateColors = function ()
{
     game.colors.r += 7;
    if (game.colors.r > 255) game.colors.r = 0;
    game.colors.g += 4;
    if (game.colors.g > 255) game.colors.g = 0;
    game.colors.b += 3;
    if (game.colors.b > 255) game.colors.b = 0;
    this.context.lineWidth = 5;
},

game.startAnimate = function(time) {

    if (game.innerWave)
        return;
    
    if (game.getAllSprites("grunt").length == 0) {
        game.gruntNumber += 5;        
        game.hulkNumber += 2;   
        game.startWave();      
        return;
    }       

    if ((this.shootX != 0 || this.shootY != 0) && !game.dead) {
        if (time - this.lastShotTime > 150) {
            // new bullet 
            this.lastShotTime = time;
            game.playSound("sound_shot");
            var bullet = new Bullet(
                game,
                game.manSprite.left + game.manSprite.width / 2,
                game.manSprite.top + game.manSprite.height / 2,
                this.shootX * game.bulletSpeed,
                this.shootY * game.bulletSpeed
            );
        }
    }

    if (!game.paused && game.manSprite.direction && !game.dead) {
        // check for death
        var grunts = game.getAllSprites();
        var left = game.manSprite.left;
        var top = game.manSprite.top;
        var width = manCells[game.manSprite.direction][0].w * 2;
        var height = manCells[game.manSprite.direction][0].h * 2;
        for (var i = 0; i < grunts.length; i++) {
            if (grunts[i].name != 'man' && grunts[i].name != 'bullet' && grunts[i].name != 'explosion' &&  
                (left + width) >= grunts[i].left && left <= grunts[i].left + grunts[i].width &&
                (top + height) >= grunts[i].top && top <= grunts[i].top + grunts[i].height) {

                // dead
                game.playSound("sound_death");
                game.dead = 1;
            }
        }
    }    
};

game.addKeyListener(
    {
        key: 'r',
        listener: function (pressed) {
            
            //togglePaused();
        }
    }
);

game.addKeyListener(
    {
        key: 'p',
        listener: function (pressed) {
            if (pressed) {
                game.paused = 0;
                game.startWave();       
                game.start();
            }
        }
    }
);

game.addKeyListener(
    {
        key: 'd',
        listener: function(pressed) {
            game.manSprite.velocityX = pressed ? game.manSpeed : 0;            
        },
    }
);


game.addKeyListener(
    {
        key: 'a',
        listener: function(pressed) {
            game.manSprite.velocityX = pressed ? -game.manSpeed : 0;
        }
    }
);

game.addKeyListener(
    {
        key: 'w',
        listener: function(pressed) {
            game.manSprite.velocityY = pressed ? -game.manSpeed : 0;
        }
    }
);

game.addKeyListener(
    {
        key: 's',
        listener: function(pressed) {
            game.manSprite.velocityY = pressed ? game.manSpeed : 0;
        }
    });

game.addKeyListener(
    {
        key: 'l',
        listener: function(pressed) {
            game.shootX = pressed ? 1 : 0;
        }
    });

game.addKeyListener(
    {
        key: 'j',
        listener: function(pressed) {
            game.shootX = pressed ? -1 : 0;
        }
    });

game.addKeyListener(
    {
        key: 'i',
        listener: function(pressed) {
            game.shootY = pressed ? -1 : 0;
        }
    });

game.addKeyListener(
    {
        key: 'k',
        listener: function(pressed) {
            game.shootY = pressed ? 1 : 0;
        }
    });

