var Bullet = Sprite.extend({
    init: function (game, left, top, velocityX, velocityY) {
        this._super('bullet', this.bulletPainter, [this.bulletMover]);
        this.game = game;
        this.left = left;
        this.top = top;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.bulletLength = 10;
        game.addSprite(this);
    },

    bulletPainter: {
        paint: function (sprite, context) {
            context.save();
            context.beginPath();
            context.strokeStyle = 'white';
            var bulletX = 0, bulletY = 0;
            if (sprite.velocityX > 0) bulletX = sprite.bulletLength;
            else if (sprite.velocityX < 0) bulletX = -sprite.bulletLength;
            if (sprite.velocityY > 0) bulletY = sprite.bulletLength;
            else if (sprite.velocityY < 0) bulletY = -sprite.bulletLength;

            context.beginPath();
            context.lineWidth = 2;
            context.moveTo(sprite.left - bulletX, sprite.top - bulletY);
            context.lineTo(sprite.left + bulletX, sprite.top + bulletY);
            context.stroke();
            context.restore();
        }
    },

    bulletMover: {
        execute: function (sprite, context, time) {
            if (!sprite.game.paused && !sprite.game.dead) {
                var deltaX = game.pixelsPerFrame(time, sprite.velocityX);
                var deltaY = game.pixelsPerFrame(time, sprite.velocityY);
                if (sprite.left + deltaX > sprite.game.right ||
                    sprite.left + deltaX < sprite.game.left ||
                    sprite.top + deltaY > sprite.game.bottom ||
                    sprite.top + deltaY < sprite.game.top) {
                    sprite.game.removeSprite(sprite);
                    return;
                }
                sprite.left += deltaX;
                sprite.top += deltaY;

                var grunts = sprite.game.getAllSprites("grunt");
                for (var i = 0; i < grunts.length; i++) {
                    var grunt = grunts[i];
                    if (sprite.left >= grunt.left && sprite.left <= grunt.left + grunt.width &&
                        sprite.top >= grunt.top && sprite.top <= grunt.top + grunt.height) {

                        var horizontal = Math.abs(sprite.velocityY) > Math.abs(sprite.velocityX);
                        var explosion = new Explosion(sprite.game, grunt.left, grunt.top, grunt.width, grunt.height, horizontal);

                        sprite.game.removeSprite(grunt);
                        sprite.game.removeSprite(sprite);
                        break;
                    }
                }

            }
        }
    }
});
    