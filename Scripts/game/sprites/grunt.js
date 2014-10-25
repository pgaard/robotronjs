var Grunt = AnimatedSprite.extend({
    init: function (game, left, top) {
        this._super('grunt', game, left, top, this.gruntMover, 'all');
        this.width = 14 * 2;
        this.height = 22 * 2;
        this.enemy = 1;
        this.mustKill = 1;
        this.canKill = 1;
    },
    score:100,
    gruntMover: {
        execute: function (sprite, context, time) {
            sprite.advanceFrame(sprite, time, 75);

            // move straight towards man
            var theta = Math.atan((sprite.top - sprite.game.manSprite.top) / (sprite.left - game.manSprite.left));
            var reverse = sprite.left > game.manSprite.left ? -1 : 1;
            sprite.velocityX = Math.cos(theta) * sprite.game.gruntSpeed * reverse;
            sprite.velocityY = Math.sin(theta) * sprite.game.gruntSpeed * reverse;

            sprite.move(sprite, time, false);
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