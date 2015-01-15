///<reference path="../Game.ts"/>
///<reference path="Sprite.ts"/>
///<reference path="SprintSheetPainter.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// a sprite with a spritesheet, directions, frames and a velocity
var AnimatedSprite = (function (_super) {
    __extends(AnimatedSprite, _super);
    function AnimatedSprite(name, game, left, top, startDirection, cells) {
        _super.call(this, name, game, left, top);
        this.velocityX = 0;
        this.velocityY = 0;
        this.lastStepTime = 0;
        this.canKill = false;
        this.mustKill = false;
        this.score = 0;
        this.spriteSheetPainter = new SpriteSheetPainter(cells, game.spritesheet, startDirection, 2);
        this.direction = startDirection;
        game.addSprite(this);
    }
    AnimatedSprite.prototype.painter = function (context) {
        this.spriteSheetPainter.paint(this, context);
    };
    AnimatedSprite.prototype.advanceFrame = function (time, stepMs, oneShot) {
        var timeDiff = time - this.lastStepTime;
        if (timeDiff > stepMs) {
            this.spriteSheetPainter.advance(this.direction, oneShot);
            this.lastStepTime = time;
            return true;
        }
        return false;
    };
    AnimatedSprite.prototype.setRandomDirection = function () {
        var rand = Math.random() * 4;
        this.velocityX = this.velocityY = 0;
        if (rand < 1) {
            if (this.direction != 'all')
                this.direction = 'left';
            this.velocityX = -this.speed;
        }
        else if (rand < 2) {
            if (this.direction != 'all')
                this.direction = 'right';
            this.velocityX = this.speed;
        }
        else if (rand < 3) {
            if (this.direction != 'all')
                this.direction = 'up';
            this.velocityY = -this.speed;
        }
        else {
            if (this.direction != 'all')
                this.direction = 'down';
            this.velocityY = this.speed;
        }
    };
    AnimatedSprite.prototype.move = function (time, wallBounce) {
        var deltaX = this.game.pixelsPerFrame(time, this.velocityX);
        var deltaY = this.game.pixelsPerFrame(time, this.velocityY);
        if (wallBounce) {
            if (this.left + this.width + deltaX > this.game.right) {
                if (this.direction != 'all')
                    this.direction = 'left';
                this.velocityX = -this.speed;
                deltaX = 0;
            }
            else if (this.left + deltaX < this.game.left) {
                if (this.direction != 'all')
                    this.direction = 'right';
                this.velocityX = this.speed;
                deltaX = 0;
            }
            if (this.top + this.height + deltaY > this.game.bottom) {
                if (this.direction != 'all')
                    this.direction = 'up';
                this.velocityY = -this.speed;
                deltaY = 0;
            }
            else if (this.top + deltaY < this.game.top) {
                if (this.direction != 'all')
                    this.direction = 'down';
                this.velocityY = this.speed;
                deltaY = 0;
            }
        }
        this.left += deltaX;
        this.top += deltaY;
    };
    AnimatedSprite.prototype.kill = function (bullet) {
    };
    return AnimatedSprite;
})(Sprite);
//# sourceMappingURL=AnimatedSprite.js.map