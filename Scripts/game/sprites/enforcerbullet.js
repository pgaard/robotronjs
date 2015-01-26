///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>
///<reference path="Bullet.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EnforcerBullet = (function (_super) {
    __extends(EnforcerBullet, _super);
    function EnforcerBullet(game, left, top, velocityX, velocityY) {
        _super.call(this, 'enforcerbullet', game, left, top, 'all', EnforcerBullet.cells);
        this.disappearing = false;
        this.width = 14 * 2;
        this.height = 14 * 2;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.enemy = true;
        this.score = 25;
    }
    EnforcerBullet.prototype.mover = function (context, time) {
        this.advanceFrame(time, 100);
        this.fireRandomEvents();
        this.move(time);
    };
    // override - hug wall
    EnforcerBullet.prototype.adjustMoveDelta = function (deltaX, deltaY) {
        var _this = this;
        var onEdge = false;
        if ((this.left + this.width + deltaX > this.game.right) || (this.left + deltaX < this.game.left)) {
            this.velocityX = 0;
            this.velocityY = (Math.random() < .5) ? this.speed : -this.speed;
            deltaX = 0;
            onEdge = true;
        }
        else if (this.top + this.height + deltaY > this.game.bottom || (this.top + deltaY < this.game.top)) {
            this.velocityY = 0;
            this.velocityX = (Math.random() < .5) ? this.speed : -this.speed;
            deltaY = 0;
            onEdge = true;
        }
        if (onEdge && !this.disappearing) {
            this.disappearing = true;
            this.queueRandomEvent(.5, 0, false, function () { return _this.game.removeSprite(_this); });
        }
        return { deltaX: deltaX, deltaY: deltaY };
    };
    EnforcerBullet.prototype.kill = function (bullet) {
        this.game.removeSprite(this);
    };
    EnforcerBullet.cells = {
        all: [
            { x: 181, y: 123, w: 14, h: 14 },
            { x: 207, y: 123, w: 14, h: 14 },
            { x: 233, y: 123, w: 14, h: 14 },
            { x: 259, y: 123, w: 14, h: 14 }
        ]
    };
    return EnforcerBullet;
})(RobotronSprite);
//# sourceMappingURL=EnforcerBullet.js.map