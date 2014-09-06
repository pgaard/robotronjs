var game = new Game("testgame", "canvas");

game.dead = 0;
game.lastShotTime = 0;
game.shootX = 0;
game.shootY = 0;
game.gruntSpeed = 50;
game.spritesheet = new Image();
game.spritesheet.src = 'images/robotronsprites.png';
var manCells = {
    left: [
        { x: 192, y: 164, w: 11, h: 22 },
        { x: 218, y: 164, w: 11, h: 22 }],
    right: [
        { x: 268, y: 164, w: 11, h: 22 },
        { x: 294, y: 164, w: 11, h: 22 }],    
    down: [
        { x: 346, y: 164, w: 15, h: 22 },
        { x: 372, y: 164, w: 15, h: 22 },
        { x: 346, y: 164, w: 15, h: 22 },
        { x: 398, y: 164, w: 15, h: 22 }],    
    up: [
        { x: 424, y: 164, w: 15, h: 22 },
        { x: 450, y: 164, w: 15, h: 22 },
        { x: 424, y: 164, w: 15, h: 22 },
        { x: 476, y: 164, w: 15, h: 22 }],       
};
    
var gruntCells = {
    all: [
        { x: 150, y: 234, w: 19, h: 26 },
        { x: 180, y: 234, w: 19, h: 26 },
        { x: 210, y: 234, w: 19, h: 26 },
    ]      
};

var manMover = {
    lastTime:0,
    execute: function (sprite, context, time) {
        if (!game.paused && !game.dead) {
            var timeDiff = time - this.lastTime;          
            var deltaX = game.pixelsPerFrame(time, sprite.velocityX);
            var deltaY = game.pixelsPerFrame(time, sprite.velocityY);

            if (sprite.velocityX != 0 || sprite.velocityY != 0) {
                if (timeDiff > 75) {
                    var direction = "down";
                    if (sprite.velocityX > 0) direction = "right";
                    else if (sprite.velocityX < 0) direction = "left";
                    else if (sprite.velocityY > 0) direction = "down";
                    else if (sprite.velocityY < 0) direction = "up";                    
                    sprite.painter.advance(direction);
                    this.lastTime = time;
                }
            }

            if (sprite.left + sprite.width + deltaX > game.width()) {
                sprite.velocityX = 0;
                deltaX = 0;                
            }
            else if (sprite.left + deltaX < 0) {
                sprite.velocityX = 0;
                deltaX = 0;
            }
            if (sprite.top + sprite.height + deltaY > game.height()) {
                sprite.velocityY = 0;
                deltaY = 0;                
            }
            else if (sprite.top + deltaY < 0) {
                sprite.velocityY = 0;
                deltaY = 0;
            }

            sprite.left += deltaX;
            sprite.top += deltaY;
        }
    }
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

game.manSprite = new Sprite('man', new SpriteSheetPainter(manCells, game.spritesheet,"left",2), [manMover]);
game.manSprite.left = game.middle().x;
game.manSprite.top = game.middle().y;
game.manSprite.width = 19 * 2;
game.manSprite.height = 26 * 2;
game.addSprite(game.manSprite);

for (var i=0; i < 100; i++) {
    var gruntSprite = new Sprite('grunt', new SpriteSheetPainter(gruntCells, game.spritesheet, "all", 2), [gruntMover]);
    do {
        gruntSprite.left = Math.round(Math.random() * game.width());
        gruntSprite.top = Math.round(Math.random() * game.height());
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
            if (sprite.left + deltaX > game.width() ||
                sprite.left + deltaX < 0 ||
                sprite.top + deltaY > game.height() ||
                sprite.top + deltaY < 0) {
                game.removeSprite(sprite);
            }                
            sprite.left += deltaX;
            sprite.top += deltaY;

            var grunts = game.getAllSprites("grunt");
            for (var i = 0; i < grunts.length; i++) {                
                if(sprite.left >= grunts[i].left && sprite.left <= grunts[i].left + grunts[i].width && 
                    sprite.top >= grunts[i].top && sprite.top <= grunts[i].top + grunts[i].height){
                    // explosions!
                    game.removeSprite(grunts[i]);
                    game.removeSprite(sprite);
                    break;
                }
            }

        }        
    }
};

game.paintUnderSprites = function() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.width(), this.height());
};

game.startAnimate = function(time) {
    if (this.shootX != 0 || this.shootY != 0) {
        if (time - this.lastShotTime > 150) {
            // new bullet 
            this.lastShotTime = time;
            var bullet = new Sprite('bullet', bulletPainter, [bulletMover]);
            var bulletSpeed = 400;
            bullet.velocityX = this.shootX * bulletSpeed;
            bullet.velocityY = this.shootY * bulletSpeed;
            bullet.top = game.manSprite.top + game.manSprite.height / 2;
            bullet.left = game.manSprite.left + game.manSprite.width / 2;            
            game.addSprite(bullet);
        }
    }
    
    // check for death
    var grunts = game.getAllSprites("grunt");
    var left = game.manSprite.left;
    var top = game.manSprite.top;
    for (var i = 0; i < grunts.length; i++) {
        if (left >= grunts[i].left && left <= grunts[i].left + grunts[i].width &&
            top >= grunts[i].top && top <= grunts[i].top + grunts[i].height) {
            
            // dead
            game.dead = 1;            
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
            game.manSprite.velocityX = pressed ? 200 : 0;            
        },
    }
);


game.addKeyListener(
    {
        key: 'a',
        listener: function(pressed) {
            game.manSprite.velocityX = pressed ? -200 : 0;
        }
    }
);

game.addKeyListener(
    {
        key: 'w',
        listener: function(pressed) {
            game.manSprite.velocityY = pressed ? -200 : 0;
        }
    }
);

game.addKeyListener(
    {
        key: 's',
        listener: function(pressed) {
            game.manSprite.velocityY = pressed ? 200 : 0;
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

