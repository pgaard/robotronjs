var Hulk = Sprite.extend({
    init: function (game, left, top) {
        this._super('hulk', new SpriteSheetPainter(this.cells, game.spritesheet, "left", 2), [this.hulkMover], game, top, left);
        this.speed = 100;
        this.width = this.cells['left'][0].w * 2;
        this.height = this.cells['left'][0].h * 2;
        this.setDirection(this);        
        game.addSprite(this);
    },

    setDirection: function (sprite) {
        var rand = Math.random() * 4;

        this.velocityX = this.velocityY = 0;

        if (rand < 1) {
            sprite.direction = 'left';
            sprite.velocityX = -this.speed;
        } else if (rand < 2) {
            sprite.direction = 'right';
            sprite.velocityX = this.speed;
        } else if (rand < 3) {
            sprite.direction = 'up';
            sprite.velocityY = -this.speed;
        } else {
            sprite.direction = 'down';
            sprite.velocityY = this.speed;
        }
    },


    // TODO: random changing movement towards player, towards family or random
    hulkMover: {
        execute: function (sprite, context, time) {
            if (!sprite.lastStepTime)
                sprite.lastStepTime = 0;
            var timeDiff = time - sprite.lastStepTime;

            if (timeDiff > 200) {
                sprite.painter.advance(sprite.direction);
                sprite.lastStepTime = time;
            }

            if (Math.random() < .005) sprite.setDirection(sprite);

            var deltaX = sprite.game.pixelsPerFrame(time, sprite.velocityX);
            var deltaY = sprite.game.pixelsPerFrame(time, sprite.velocityY);

            if (sprite.left + sprite.width + deltaX > game.right) {
                sprite.direction = 'left';
                sprite.velocityX = -sprite.speed;
                deltaX = 0;
            } else if (sprite.left + deltaX < game.left) {
                sprite.direction = 'right';
                sprite.velocityX = sprite.speed;
                deltaX = 0;
            }
            if (sprite.top + sprite.height + deltaY > game.bottom) {
                sprite.direction = 'up';
                sprite.velocityY = -sprite.speed;
                deltaY = 0;
            } else if (sprite.top + deltaY < game.top) {
                sprite.direction = 'down';
                sprite.velocityY = sprite.speed;
                deltaY = 0;
            }

            sprite.left += deltaX;
            sprite.top += deltaY;
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