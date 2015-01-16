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
    AnimatedSprite.prototype.adjustMoveDelta = function (deltaX, deltaY) {
        return { deltaX: deltaX, deltaY: deltaY };
    };
    AnimatedSprite.prototype.move = function (time) {
        var deltaX = this.game.pixelsPerFrame(time, this.velocityX);
        var deltaY = this.game.pixelsPerFrame(time, this.velocityY);
        var deltas = this.adjustMoveDelta(deltaX, deltaY);
        this.left += deltas.deltaX;
        this.top += deltas.deltaY;
    };
    return AnimatedSprite;
})(Sprite);
//# sourceMappingURL=AnimatedSprite.js.map