// a sprite with a spritesheet, directions, frames and a velocity
var AnimatedSprite = Sprite.extend({
    init: function (name, game, left, top, mover, startDirection) {
        this._super(name, new SpriteSheetPainter(this.cells, game.spritesheet, startDirection, 2), [mover], game, top, left);
        game.addSprite(this);
    },

    advanceFrame: function(sprite, time, stepMs){
        if (!sprite.lastStepTime)
            sprite.lastStepTime = 0;
        var timeDiff = time - sprite.lastStepTime;

        if (timeDiff > stepMs) {
            sprite.painter.advance(sprite.direction);
            sprite.lastStepTime = time;
        }
    },

    setRandomDirection: function (sprite) {
        var rand = Math.random() * 4;

        this.velocityX = this.velocityY = 0;

        if (rand < 1) {
            sprite.direction = 'left';
            sprite.velocityX = -this.speed;
        } else if (rand < 2) {
            sprite.direction = 'right';
            sprite.velocityX = this.speed;
        } else if (rand < 3) {
            sprite.direction = 'up';
            sprite.velocityY = -this.speed;
        } else {
            sprite.direction = 'down';
            sprite.velocityY = this.speed;
        }
    },

    move: function(sprite, time, wallBounce){
        var deltaX = sprite.game.pixelsPerFrame(time, sprite.velocityX);
        var deltaY = sprite.game.pixelsPerFrame(time, sprite.velocityY);

        if(wallBounce) {
            if (sprite.left + sprite.width + deltaX > game.right) {
                sprite.direction = 'left';
                sprite.velocityX = -sprite.speed;
                deltaX = 0;
            } else if (sprite.left + deltaX < game.left) {
                sprite.direction = 'right';
                sprite.velocityX = sprite.speed;
                deltaX = 0;
            }
            if (sprite.top + sprite.height + deltaY > game.bottom) {
                sprite.direction = 'up';
                sprite.velocityY = -sprite.speed;
                deltaY = 0;
            } else if (sprite.top + deltaY < game.top) {
                sprite.direction = 'down';
                sprite.velocityY = sprite.speed;
                deltaY = 0;
            }
        }

        sprite.left += deltaX;
        sprite.top += deltaY;
    }
});
