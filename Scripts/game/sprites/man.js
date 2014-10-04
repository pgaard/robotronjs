var Man = AnimatedSprite.extend({
    init: function (game, left, top) {
        this._super('man', game, left, top, this.manMover, "down");
        this.width = 19 * 2;
        this.height = 22 * 2;
        game.addSprite(this);
    },
    manMover: {
        lastTime: 0,
        execute: function (sprite, context, time) {

            if(sprite.velocityX != 0 || sprite.velocityY != 0)
                if(sprite.advanceFrame(sprite, time, 75)){
                    //sprite.game.playSound("sound_walking");
                }

            var deltaX = game.pixelsPerFrame(time, sprite.velocityX);
            var deltaY = game.pixelsPerFrame(time, sprite.velocityY);

            if (sprite.velocityX > 0) sprite.direction  = "right";
            else if (sprite.velocityX < 0) sprite.direction  = "left";
            else if (sprite.velocityY > 0) sprite.direction  = "down";
            else if (sprite.velocityY < 0) sprite.direction  = "up";

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