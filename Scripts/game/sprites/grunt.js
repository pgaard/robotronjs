var Grunt = AnimatedSprite.extend({
    init: function (game, left, top) {
        this._super('grunt', game, left, top, this.gruntMover, 'all');
        this.width = 14 * 2;
        this.height = 22 * 2;
        this.enemy = 1;
        this.mustKill = 1;
        this.score = 100;
    },
    gruntMover: {
        execute: function (sprite, context, time) {

            // speed up during wave
            var speed = 50 + (sprite.game.waveDuration ? (sprite.game.waveDuration * 0.004) : 1);

            sprite.advanceFrame(sprite, time, 75);

            // move straight towards man
            var theta = Math.atan((sprite.top - sprite.game.manSprite.top) / (sprite.left - game.manSprite.left));
            var reverse = sprite.left > game.manSprite.left ? -1 : 1;
            sprite.velocityX = Math.cos(theta) * speed * reverse;
            sprite.velocityY = Math.sin(theta) * speed * reverse;

            sprite.move(sprite, time, false);
        }
    },

    kill : function(bullet){
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        bullet.game.playSound("sound_kill");
        this.game.removeSprite(this);
    },

    cells: {
        all: [
            { x: 150, y: 234, w: 19, h: 27 },
            { x: 180, y: 234, w: 19, h: 27 },
            { x: 210, y: 234, w: 19, h: 27 }
        ]
    }
});