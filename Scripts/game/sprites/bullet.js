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

                // hit handling - should be somewhere better
                var enemies = sprite.game.getAllSprites();
                for (var i = 0; i < enemies.length; i++) {
                    var enemy = enemies[i];
                    if (!(enemy instanceof Grunt) && !(enemy instanceof Hulk) && !(enemy instanceof Electrode))
                        continue;

                    if (sprite.left >= enemy.left && sprite.left <= enemy.left + enemy.width &&
                        sprite.top >= enemy.top && sprite.top <= enemy.top + enemy.height) {

                        if (enemy instanceof Grunt) {
                            var horizontal = Math.abs(sprite.velocityY) > Math.abs(sprite.velocityX);
                            var explosion = new Explosion(sprite.game, enemy.left, enemy.top, enemy.width, enemy.height, horizontal);
                            sprite.game.playSound("sound_kill");
                            sprite.game.removeSprite(enemy);
                        }
                        else if (enemy instanceof Hulk) {
                            if (deltaX) enemy.left += 7 * (deltaX / Math.abs(deltaX));
                            if (deltaY) enemy.top += 7 * (deltaY / Math.abs(deltaY));
                        }
                        else if (enemy instanceof Electrode) {
                            sprite.game.playSound("sound_kill");
                            enemy.hit = 1;
                        }
                        sprite.game.removeSprite(sprite);
                        break;
                    }
                }

            }
        }
    }
});
    