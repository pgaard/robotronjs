var Enforcer = AnimatedSprite.extend({
    init: function (game, left, top) {
        this._super('enforcer', game, left, top, this.mover, 'all');
        this.width = 18 * 2;
        this.height = 22 * 2;
        this.enemy = 1;
        this.mustKill = 1;
        this.score = 100;
        this.speed = 200;
        this.setRandomDirectionEnforcer(this);
    },
    mover: {
        execute: function (sprite, context, time) {
            sprite.advanceFrame(sprite, time, 200, true); // just grows and stops animating
            if (Math.random() < .01) sprite.setRandomDirectionEnforcer(sprite);
            sprite.move(sprite, time, true);

            if (Math.random() < .005){
                // shoot
                var distance = game.distance(sprite.left, sprite.top, game.manSprite.left, sprite.game.manSprite.top );
                var bulletSpeed =  (distance / game.width()) * 600;
                var theta = Math.atan((sprite.top - sprite.game.manSprite.top) / (sprite.left - sprite.game.manSprite.left));
                var reverse = sprite.left > game.manSprite.left ? -1 : 1;
                var velocityX = Math.cos(theta) * bulletSpeed * reverse;
                var velocityY = Math.sin(theta) * bulletSpeed * reverse;
                var bullet = new EnforcerBullet(sprite.game, sprite.left, sprite.top, velocityX, velocityY);
                bullet.speed = bulletSpeed;
                sprite.game.playSound("sound_enforcershot");
            }
        }
    },

    // override
    setRandomDirectionEnforcer: function (sprite) {
        this.speed = (Math.random() * 150) + 25;
        var theta = 2 * Math.PI * Math.random();
        sprite.velocityX = Math.cos(theta) * sprite.speed;
        sprite.velocityY = Math.sin(theta) * sprite.speed;
    },

    kill : function(bullet){
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        bullet.game.playSound("sound_kill");
        this.game.removeSprite(this);
    },

    cells: {
        all: [
            { x: 1 + 30*1, y: 123, w: 18, h: 22 },
            { x: 1 + 30*2, y: 123, w: 18, h: 22 },
            { x: 1 + 30*3, y: 123, w: 18, h: 22 },
            { x: 1 + 30*4, y: 123, w: 18, h: 22 },
            { x: 1 + 30*5, y: 123, w: 18, h: 22 },
            { x: 1, y: 123, w: 18, h: 22 }
        ]
    }
});