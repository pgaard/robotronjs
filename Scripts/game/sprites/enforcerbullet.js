var EnforcerBullet = AnimatedSprite.extend({
    init: function (game, left, top, velocityX, velocityY) {
        this._super('enforcerbullet', game, left, top, this.mover, 'all');
        this.width = 14 * 2;
        this.height = 14 * 2;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.enemy = 1;
        this.score = 0;
    },
    mover: {
        execute: function (sprite, context, time) {
            sprite.advanceFrame(sprite, time, 100);
            sprite.move(sprite, time);
        }
    },

    // override - hug walls
    move: function(sprite, time, wallBounce){
        var deltaX = sprite.game.pixelsPerFrame(time, sprite.velocityX);
        var deltaY = sprite.game.pixelsPerFrame(time, sprite.velocityY);

        if ((sprite.left + sprite.width + deltaX > game.right) ||
            (sprite.left + deltaX < game.left) ) {
            sprite.velocityX = 0;
            sprite.velocityY = (Math.random() < .5) ? sprite.speed : -sprite.speed;
            deltaX = 0;
        }
        else if (sprite.top + sprite.height + deltaY > game.bottom ||
            (sprite.top + deltaY < game.top)) {
            sprite.velocityY = 0;
            sprite.velocityX = (Math.random() < .5) ? sprite.speed : -sprite.speed;
            deltaY = 0;
        }

        sprite.left += deltaX;
        sprite.top += deltaY;
    },

    kill : function(bullet){
        this.game.removeSprite(this);
    },

    cells: {
        all: [
            { x: 181, y: 123, w: 14, h: 14 },
            { x: 207, y: 123, w: 14, h: 14 },
            { x: 233, y: 123, w: 14, h: 14 },
            { x: 259, y: 123, w: 14, h: 14 }
        ]
    }
});