var game = new Game("testgame", "canvas");

game.dead = 0;
game.lastShotTime = 0;
game.shootX = 0;
game.shootY = 0;
game.gruntSpeed = 100;
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

var gruntMover = {
    execute: function(sprite, context, time) {
        if (!game.paused && !game.dead) {
            if (!sprite.lastTime)
                sprite.lastTime = 0;
            var timeDiff = time - sprite.lastTime;

            var theta = Math.atan((sprite.top - game.manSprite.top) / (sprite.left - game.manSprite.left));
            var reverse = sprite.left > game.manSprite.left ? -1 : 1;
            sprite.velocityX = Math.cos(theta) * game.gruntSpeed * reverse;
            sprite.velocityY = Math.sin(theta) * game.gruntSpeed * reverse;
            if (timeDiff > 75) {
                sprite.painter.advance('all');
                sprite.lastTime = time;
            }
            
            var deltaX = game.pixelsPerFrame(time, sprite.velocityX);
            var deltaY = game.pixelsPerFrame(time, sprite.velocityY);
            
            sprite.left += deltaX;
            sprite.top += deltaY;
        }   
    }
};

game.manSprite = new Man(game, game.middle().x, game.middle().y);

for (var i=0; i < 20; i++) {
    var gruntSprite = new Sprite('grunt', new SpriteSheetPainter(gruntCells, game.spritesheet, "all", 2), [gruntMover]);
    do {
        gruntSprite.left = Math.round(Math.random() * (game.right - game.left)) + game.left;
        gruntSprite.top = Math.round(Math.random() * (game.bottom - game.top)) + game.top;
        var distance = game.distance(gruntSprite.left, gruntSprite.top, game.manSprite.left, game.manSprite.top);
    }  while (distance < 300);
    gruntSprite.width = 14 * 2;
    gruntSprite.height = 22 * 2;
    game.addSprite(gruntSprite);    
}

var bulletPainter = {
    paint: function(sprite, context) {
        var bulletLength = 10;
        context.save();                
        context.beginPath();        
        context.strokeStyle = 'white';        
        var bulletX = 0, bulletY = 0;
        if (sprite.velocityX > 0) bulletX = bulletLength;
        else if(sprite.velocityX < 0) bulletX = -bulletLength;
        if (sprite.velocityY > 0) bulletY = bulletLength;
        else if(sprite.velocityY < 0) bulletY = -bulletLength;  
        
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(sprite.left - bulletX, sprite.top - bulletY);
        context.lineTo(sprite.left + bulletX, sprite.top + bulletY);
        context.stroke();
        context.restore();
    }
};

var bulletMover = {
    execute: function(sprite, context, time) {
        if (!game.paused && !game.dead) {
            var deltaX = game.pixelsPerFrame(time, sprite.velocityX);
            var deltaY = game.pixelsPerFrame(time, sprite.velocityY);
            if (sprite.left + deltaX > game.right ||
                sprite.left + deltaX < game.left ||
                sprite.top + deltaY > game.bottom ||
                sprite.top + deltaY < game.top) {
                game.removeSprite(sprite);
            }                
            sprite.left += deltaX;
            sprite.top += deltaY;

            var grunts = game.getAllSprites("grunt");
            for (var i = 0; i < grunts.length; i++) {                
                if(sprite.left >= grunts[i].left && sprite.left <= grunts[i].left + grunts[i].width && 
                    sprite.top >= grunts[i].top && sprite.top <= grunts[i].top + grunts[i].height) {


                    var grunt = grunts[i];
                    
                    // make explosion
                    var explosion = new Sprite('explosion', explosionPainter, [explosionMover]);                    
                    explosion.top = grunt.top;
                    explosion.height = grunt.height;
                    explosion.left = grunt.left;
                    explosion.width = grunt.width;
                    explosion.horizontal = Math.abs(sprite.velocityY) > Math.abs(sprite.velocityX);
                    game.addSprite(explosion);

                    // remove grunt and bullet
                    game.removeSprite(grunts[i]);
                    game.removeSprite(sprite);
                    game.score += 100;
                    
                    break;
                }
            }

        }        
    }
};

game.paintUnderSprites = function() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.width(), this.height());
    game.rotateColors();    
    this.context.strokeStyle = 'rgb(' + game.colors.r + ',' + game.colors.g + ',' + game.colors.b + ')';      
    this.context.strokeRect(this.left, this.top, this.right - this.left, this.bottom - this.top);
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
    if ((this.shootX != 0 || this.shootY != 0) && !game.dead) {
        if (time - this.lastShotTime > 150) {
            // new bullet 
            this.lastShotTime = time;
            var bullet = new Sprite('bullet', bulletPainter, [bulletMover]);            
            bullet.velocityX = this.shootX * game.bulletSpeed;
            bullet.velocityY = this.shootY * game.bulletSpeed;
            bullet.top = game.manSprite.top + game.manSprite.height / 2;
            bullet.left = game.manSprite.left + game.manSprite.width / 2;            
            game.addSprite(bullet);
        }
    }

    if (!game.paused && game.manSprite.direction) {
        // check for death
        var grunts = game.getAllSprites("grunt");
        var left = game.manSprite.left;
        var top = game.manSprite.top;
        var width = manCells[game.manSprite.direction][0].w * 2;
        var height = manCells[game.manSprite.direction][0].h * 2;
        for (var i = 0; i < grunts.length; i++) {
            if ((left + width) >= grunts[i].left && left <= grunts[i].left + grunts[i].width &&
                (top + height) >= grunts[i].top && top <= grunts[i].top + grunts[i].height) {

                // dead
                game.dead = 1;
            }
        }
    }

    game.gruntSpeed = 50 + time * .002;
};

game.addKeyListener(
    {
        key: 'p',
        listener: function (pressed) {
            game.start();
            //togglePaused();
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

