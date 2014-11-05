var Spheroid = AnimatedSprite.extend({
    init: function (game, left, top) {
        this._super('spheroid', game, left, top, this.mover, "all");
        this.speed = 200;
        this.width = this.cells['all'][0].w * 2;
        this.height = this.cells['all'][0].h * 2;
        this.enemy = 1;
        this.mustKill = 1;
        this.score = 1000;
        this.spawns = 0;
        this.setDirectionSpheroid(this);
        this.startTime = getTimeNow();
    },
    mover: {
        execute: function (sprite, context, time) {
            sprite.advanceFrame(sprite, time, 25);
            if (Math.random() < .005) sprite.setDirectionSpheroid(sprite);

            // after 5 sec spawn 4 enforcers at random interval
            if ((getTimeNow() - sprite.startTime > 5000) && Math.random() < 0.01) {
                new Enforcer(sprite.game, sprite.left, sprite.top);
                sprite.spawns++;
                if(sprite.spawns == 4){
                    sprite.game.removeSprite(sprite);
                }
            }
            sprite.move(sprite, time, true);
        }
    },

    // override
    setDirectionSpheroid: function (sprite) {
        var theta = 2 * Math.PI * Math.random();
        sprite.velocityX = Math.cos(theta) * sprite.speed;
        sprite.velocityY = Math.sin(theta) * sprite.speed;
    },

    // override - hug walls
    move: function(sprite, time, wallBounce){
        var deltaX = sprite.game.pixelsPerFrame(time, sprite.velocityX);
        var deltaY = sprite.game.pixelsPerFrame(time, sprite.velocityY);

        if(wallBounce) {
            if ((sprite.left + sprite.width + deltaX > game.right) ||
               (sprite.left + deltaX < game.left) ) {
                sprite.velocityX = 0;
                sprite.velocityY = (Math.random() < .5) ? sprite.speed : -sprite.speed;
                deltaX = 0;
            }
            else if (sprite.top + sprite.height + deltaY > game.bottom ||
                    (sprite.top + deltaY < game.top)) {
                sprite.velocityY = 0;
                sprite.velocityX = (Math.random() < .5) ? sprite.speed : -sprite.speed;
                deltaY = 0;
            }
        }

        sprite.left += deltaX;
        sprite.top += deltaY;
    },

    kill : function(bullet){
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        bullet.game.playSound("sound_kill"); // TODO: different sound
        this.game.removeSprite(this);
        game.addSprite(new Bonus(game, this.left, this.top, "1000" ));
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
