var Bullet = Sprite.extend({
    init: function (game, left, top, velocityX, velocityY) {
        this._super('bullet', this.bulletPainter, [this.bulletMover], game, left, top);
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.bulletLength = 10;
        game.addSprite(this);
    },

    bulletPainter: {
        paint: function (sprite, context) {
            context.save();
            context.beginPath();
            context.strokeStyle = game.rgbColors();
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
        execute: function (bullet, context, time) {

            var deltaX = game.pixelsPerFrame(time, bullet.velocityX);
            var deltaY = game.pixelsPerFrame(time, bullet.velocityY);
            if (bullet.left + deltaX > bullet.game.right ||
                bullet.left + deltaX < bullet.game.left ||
                bullet.top + deltaY > bullet.game.bottom ||
                bullet.top + deltaY < bullet.game.top) {
                bullet.game.removeSprite(bullet);
                return;
            }
            bullet.left += deltaX;
            bullet.top += deltaY;

            // hit handling - should be somewhere better
            var sprites = bullet.game.getAllSprites();
            for (var i = 0; i < sprites.length; i++) {
                var enemy = sprites[i];
                if (!(enemy.canKill))
                    continue;

                if (bullet.left >= enemy.left && bullet.left <= enemy.left + enemy.width &&
                    bullet.top >= enemy.top && bullet.top <= enemy.top + enemy.height) {

                    // TODO: move hit handling to sprite class
                    if (enemy instanceof Grunt || enemy instanceof Spheroid) {
                        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
                        var explosion = new Explosion(bullet.game, enemy.left, enemy.top, enemy.width, enemy.height, horizontal);
                        bullet.game.playSound("sound_kill");
                        bullet.game.removeSprite(enemy);
                    }
                    else if (enemy instanceof Hulk) {
                        if (deltaX) enemy.left += 7 * (deltaX / Math.abs(deltaX));
                        if (deltaY) enemy.top += 7 * (deltaY / Math.abs(deltaY));
                    }
                    else if (enemy instanceof Electrode) {
                        bullet.game.playSound("sound_kill");
                        enemy.hit = 1;
                    }
                    if (enemy.score)
                        bullet.game.increaseScore(enemy.score);
                    bullet.game.removeSprite(bullet);
                    break;
                }
            }
        }
    }
});
    