var Hulk = AnimatedSprite.extend({
    init: function (game, left, top) {
        this._super('hulk', game, top, left, this.hulkMover, "left");
        this.speed = 50;
        this.width = this.cells['left'][0].w * 2;
        this.height = this.cells['left'][0].h * 2;
        this.enemy = 1;
        this.setRandomDirection(this);
    },

    // TODO: random changing movement towards player, towards family or random
    hulkMover: {
        execute: function (sprite, context, time) {
            sprite.advanceFrame(sprite, time, 200);
            if (Math.random() < .005) sprite.setRandomDirection(sprite);
            sprite.move(sprite, time, true);
        }
    },

    cells: {
        left: [
            { x: 535, y: 38, w: 24, h: 29 },
            { x: 573, y: 38, w: 24, h: 29 },
            { x: 535, y: 38, w: 24, h: 29 },
            { x: 1, y: 80, w: 24, h: 29}],
        right: [
            { x: 153, y: 81, w: 24, h: 28 },
            { x: 191, y: 81, w: 24, h: 28 },
            { x: 153, y: 81, w: 24, h: 28 },
            { x: 229, y: 81, w: 24, h: 28 }],
        up: [
            { x: 39, y: 81, w: 35, h: 29 },
            { x: 77, y: 81, w: 35, h: 33 },
            { x: 39, y: 81, w: 35, h: 29 },
            { x: 115, y: 81, w: 35, h: 33 }],
        down: [
            { x: 39, y: 81, w: 35, h: 29 },
            { x: 77, y: 81, w: 35, h: 33 },
            { x: 39, y: 81, w: 35, h: 29 },
            { x: 115, y: 81, w: 35, h: 33 }]
    }    
})