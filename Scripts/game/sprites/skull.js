var Skull = AnimatedSprite.extend({
    init: function (game, left, top) {
        this._super('skull', game, left, top, this.mover, 'all');
        this.startTime = getTimeNow();
        game.addSprite(this);
    },
    mover: {
        execute: function (sprite, context, time) {
            if(getTimeNow() - sprite.startTime > 1500)
                sprite.game.removeSprite(sprite);
        }
    },

    cells: {
        all: [
            { x: 1, y: 1, w: 22, h: 22 }
        ]
    }
});