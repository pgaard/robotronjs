var Spheroid = AnimatedSprite.extend({
    init: function (game, left, top) {
        this._super('spheroid', game, top, left, this.mover, "all");
        this.speed = 200;
        this.width = this.cells['all'][0].w * 2;
        this.height = this.cells['all'][0].h * 2;
        this.enemy = 1;
        this.mustKill = 1;
        this.canKill = 1;
        this.setDirectionSpheroid(this);
    },

    // TODO: random changing movement towards player, towards family or random
    mover: {
        execute: function (sprite, context, time) {
            sprite.advanceFrame(sprite, time, 100);
            if (Math.random() < .005) sprite.setDirectionSpheroid(sprite);
            sprite.move(sprite, time, true);
        }
    },

    setDirectionSpheroid: function (sprite) {
        var rand = Math.random() * 4;

        this.velocityX = this.velocityY = 0;

        if (rand < 1) {
            sprite.velocityX = -this.speed;
        } else if (rand < 2) {
            sprite.velocityX = this.speed;
        } else if (rand < 3) {
            sprite.velocityY = -this.speed;
        } else {
            sprite.velocityY = this.speed;
        }
    },

    cells: {
        all: [
            { x: 561-42*7, y: 81, w: 30, h: 30 },
            { x: 561-42*6, y: 81, w: 30, h: 30 },
            { x: 561-42*5, y: 81, w: 30, h: 30 },
            { x: 561-42*4, y: 81, w: 30, h: 30 },
            { x: 561-42*3, y: 81, w: 30, h: 30 },
            { x: 561-42*2, y: 81, w: 30, h: 30 },
            { x: 561-42, y: 81, w: 30, h: 30 },
            { x: 561, y: 81, w: 30, h: 30 },
            { x: 561-42, y: 81, w: 30, h: 30 },
            { x: 561-42*2, y: 81, w: 30, h: 30 },
            { x: 561-42*3, y: 81, w: 30, h: 30 },
            { x: 561-42*4, y: 81, w: 30, h: 30 },
            { x: 561-42*5, y: 81, w: 30, h: 30 },
            { x: 561-42*6, y: 81, w: 30, h: 30 },
        ]
    }
})
