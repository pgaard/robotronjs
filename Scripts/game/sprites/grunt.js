var Grunt = Sprite.extend({
    init: function (game, left, top) {
        this._super('grunt', new SpriteSheetPainter(this.cells, game.spritesheet, "all", 2), [this.gruntMover]);
        this.game = game;
        this.left = left;
        this.top = top;
        this.width = 14 * 2;
        this.height = 22 * 2;
        game.addSprite(this);
    },
    score:100,
    gruntMover: {
        execute: function (sprite, context, time) {
            if (!sprite.game.paused && !sprite.game.dead) {
                if (!sprite.lastTime)
                    sprite.lastTime = 0;
                var timeDiff = time - sprite.lastTime;

                // move straight towards man
                var theta = Math.atan((sprite.top - sprite.game.manSprite.top) / (sprite.left - game.manSprite.left));
                var reverse = sprite.left > game.manSprite.left ? -1 : 1;
                sprite.velocityX = Math.cos(theta) * sprite.game.gruntSpeed * reverse;
                sprite.velocityY = Math.sin(theta) * sprite.game.gruntSpeed * reverse;
                if (timeDiff > 75) {
                    sprite.painter.advance('all');
                    sprite.lastTime = time;
                }

                var deltaX = sprite.game.pixelsPerFrame(time, sprite.velocityX);
                var deltaY = sprite.game.pixelsPerFrame(time, sprite.velocityY);

                sprite.left += deltaX;
                sprite.top += deltaY;
            }
        }
    },

    cells: {
        all: [
            { x: 150, y: 234, w: 19, h: 27 },
            { x: 180, y: 234, w: 19, h: 27 },
            { x: 210, y: 234, w: 19, h: 27 }
        ]
    }
});