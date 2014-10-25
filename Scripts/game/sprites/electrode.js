var Electrode = Sprite.extend({
    init: function (game, left, top, type) {
        this._super('electrode', this.electrodePainter, [this.electrodeMover], game, top, left);
        this.type = type;
        this.hit = 0;
        this.width = 10 * 2;
        this.height = 18 * 2;
        this.enemy = 1;
        this.canKill = 1;
        game.addSprite(this);
    },
    electrodePainter: {
        paint: function (sprite,context) {
            context.save();

            context.fillStyle = 'rgb(' + sprite.game.colors.r + ',' + sprite.game.colors.g + ',' + sprite.game.colors.b + ')';
            context.fillRect(sprite.left, sprite.top, sprite.width, sprite.height);

            context.restore();
        }
    },

    electrodeMover: {
        execute: function (sprite, context, time) {
            if (sprite.hit) {
                sprite.width -= 1;
                sprite.height -= 1;

                if (sprite.height == 0 || sprite.width == 0) {
                    sprite.game.removeSprite(sprite);
                }
            }
        }
    }
});