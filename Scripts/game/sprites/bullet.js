var Bullet = Sprite.extend({
    init: function (game, left, top, shootX, shootY) {
        this._super('bullet', this.bulletPainter, [this.bulletMover], game, left, top);
        this.bulletSpeed = 1000;
        this.velocityX = shootX * this.bulletSpeed;
        this.velocityY = shootY * this.bulletSpeed;
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
        }
    }
});
    