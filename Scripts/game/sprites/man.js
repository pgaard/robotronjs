var Man = Sprite.extend({
    init: function (game, left, top) {
        this._super('man', new SpriteSheetPainter(this.cells, game.spritesheet, "left", 2), [this.manMover]);
        this.game = game;
        this.left = left;
        this.top = top;
        this.width = 19 * 2;
        this.height = 22 * 2;
        game.addSprite(this);
    },
    manMover: {
        lastTime: 0,
        execute: function (sprite, context, time) {
            if (!game.paused && !game.dead) {
                var timeDiff = time - this.lastTime;
                var deltaX = game.pixelsPerFrame(time, sprite.velocityX);
                var deltaY = game.pixelsPerFrame(time, sprite.velocityY);

                if (sprite.velocityX != 0 || sprite.velocityY != 0) {
                    if (timeDiff > 75) {
                        var direction = "down";
                        if (sprite.velocityX > 0) direction = "right";
                        else if (sprite.velocityX < 0) direction = "left";
                        else if (sprite.velocityY > 0) direction = "down";
                        else if (sprite.velocityY < 0) direction = "up";
                        sprite.direction = direction;
                        sprite.painter.advance(direction);
                        if (sprite.game.shootX == 0 && sprite.game.shootY == 0)
                            sprite.game.playSound("sound_walking");
                        this.lastTime = time;
                    }
                }

                if (sprite.left + sprite.width + deltaX > game.right) {
                    sprite.velocityX = 0;
                    deltaX = 0;
                } else if (sprite.left + deltaX < game.left) {
                    sprite.velocityX = 0;
                    deltaX = 0;
                }
                if (sprite.top + sprite.height + deltaY > game.bottom) {
                    sprite.velocityY = 0;
                    deltaY = 0;
                } else if (sprite.top + deltaY < game.top) {
                    sprite.velocityY = 0;
                    deltaY = 0;
                }

                sprite.left += deltaX;
                sprite.top += deltaY;
            }
        }
    },
    cells: {
        left: [
            { x: 192, y: 164, w: 11, h: 22 },
            { x: 218, y: 164, w: 11, h: 22}],
        right: [
            { x: 268, y: 164, w: 11, h: 22 },
            { x: 294, y: 164, w: 11, h: 22}],
        down: [
            { x: 346, y: 164, w: 15, h: 22 },
            { x: 372, y: 164, w: 15, h: 22 },
            { x: 346, y: 164, w: 15, h: 22 },
            { x: 398, y: 164, w: 15, h: 22}],
        up: [
            { x: 424, y: 164, w: 15, h: 22 },
            { x: 450, y: 164, w: 15, h: 22 },
            { x: 424, y: 164, w: 15, h: 22 },
            { x: 476, y: 164, w: 15, h: 22}]
    }
});