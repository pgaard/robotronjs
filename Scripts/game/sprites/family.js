var Family = Sprite.extend({
    init:function(game, left, top){
        var painter = new SpriteSheetPainter(this.cells, game.spritesheet, "left", 2);
        this._super(this.name, painter, [this.familyMover], game, top, left);
        this.speed = 50;
        this.direction = "left";
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
    familyMover : {
        lastTime: 0,
        execute: function (sprite, context, time) {
            if (!game.paused && !game.dead) {
                if (!sprite.lastStepTime)
                    sprite.lastStepTime = 0;
                var timeDiff = time - sprite.lastTime;
                var deltaX = game.pixelsPerFrame(time, sprite.velocityX);
                var deltaY = game.pixelsPerFrame(time, sprite.velocityY);

                if (timeDiff > 200) {
                    sprite.painter.advance(sprite.direction);
                    sprite.lastStepTime = time;
                }

                if (Math.random() < .005) sprite.setDirection(sprite);

                var deltaX = sprite.game.pixelsPerFrame(time, sprite.velocityX);
                var deltaY = sprite.game.pixelsPerFrame(time, sprite.velocityY);

                sprite.left += deltaX;
                sprite.top += deltaY;
            }
        }
    }

});