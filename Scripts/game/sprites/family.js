var Family = AnimatedSprite.extend({
    init:function(name, game, left, top){
        this._super(name, game, left, top, this.familyMover, "left");
        this.speed = 20;
        this.setRandomDirection(this);
        game.addSprite(this);
    },

    familyMover : {
        lastTime: 0,
        execute: function (sprite, context, time) {
            sprite.advanceFrame(sprite, time, 200);
            if (Math.random() < .005) sprite.setRandomDirection(sprite);
            sprite.move(sprite, time, true);
        }
    }
});