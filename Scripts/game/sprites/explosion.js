var Explosion = Sprite.extend({
    init: function (game, left, top, width, height, horizontal) {
        this._super('explosion', this.explosionPainter, [this.explosionMover], game, top, left);
        this.height = height;
        this.width = width;
        this.horizontal = horizontal;
        this.spacing = 1;
        game.addSprite(this);
    },

    explosionPainter: {
        paint: function (sprite, context) {
            context.save();
            context.strokeStyle = 'white';

            var middleX = sprite.left + sprite.width / 2;
            var middleY = sprite.top + sprite.height / 2;
            var halfHeight = sprite.height / 2;
            var halfWidth = sprite.width / 2;
            var explosionWidth = Math.max(1, sprite.spacing / 4);
            context.lineWidth = 2;

            if (sprite.horizontal) {

                for (var x = middleX - halfWidth * sprite.spacing; x < middleX + halfWidth * sprite.spacing; x += sprite.spacing) {
                    context.beginPath();
                    context.moveTo(x, middleY - halfHeight / explosionWidth);
                    context.lineTo(x, middleY + halfHeight / explosionWidth);
                    context.stroke();
                }
            } else {

                for (var y = middleY - halfHeight * sprite.spacing; y < middleY + halfHeight * sprite.spacing; y += sprite.spacing) {
                    context.beginPath();
                    context.moveTo(middleX - halfWidth / explosionWidth, y);
                    context.lineTo(middleX + halfWidth / explosionWidth, y);
                    context.stroke();
                }
            }

            context.restore();
        }
    },

    explosionMover: {
        execute: function (sprite, context, time) {
            if (!game.paused && !game.dead) {
                sprite.spacing += .5;
                if (sprite.spacing > 10) {
                    game.removeSprite(sprite);
                    return;
                }
            }
        }
    }
});