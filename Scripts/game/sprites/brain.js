var Brain = AnimatedSprite.extend({
    init: function (game, left, top) {
        this._super('brain', game, left, top, this.mover, "left");
        this.speed = 50;
        this.width = this.cells['left'][0].w * 2;
        this.height = this.cells['left'][0].h * 2;
        this.enemy = 1;
        this.mustKill = 1;
        this.score = 100;
        this.setRandomDirection(this);
    },

    // TODO: random changing movement towards player, towards family or random
    mover: {
        execute: function (sprite, context, time) {
            sprite.advanceFrame(sprite, time, 200);
            if (Math.random() < .005) sprite.setRandomDirection(sprite);
            sprite.move(sprite, time, true);
        }
    },

    kill : function(bullet){
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        bullet.game.playSound("sound_kill");
        this.game.removeSprite(this);
    },

    cells: {
        left: [
            { x: 321, y: 123, w: 22, h: 30 },
            { x: 321 + 38, y: 123, w: 22, h: 30 },
            { x: 321, y: 123, w: 22, h: 30 },
            { x: 321 + 38*2, y: 123, w: 22, h: 30 }],
        right: [
            { x: 321 + 38*3, y: 123, w: 22, h: 30 },
            { x: 321 + 38*4, y: 123, w: 22, h: 30 },
            { x: 321 + 38*3, y: 123, w: 22, h: 30 },
            { x: 321 + 38*5, y: 123, w: 22, h: 30 }],
        up: [
            { x: 1+38*2, y: 165, w: 26, h: 30 },
            { x: 1+38*3, y: 165, w: 26, h: 32 },
            { x: 1+38*4, y: 165, w: 26, h: 30 },
            { x: 1+38*3, y: 165, w: 26, h: 32 }],
        down: [
            { x: 547, y: 123, w: 26, h: 30 },
            { x: 1, y: 165, w: 26, h: 32 },
            { x: 1+38, y: 165, w: 26, h: 32 },
            { x: 1, y: 165, w: 26, h: 32 }]
    }
})