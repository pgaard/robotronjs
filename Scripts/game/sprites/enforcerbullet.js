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
        this.onEdge = false;
        this.width = 14 * 2;
        this.height = 14 * 2;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.enemy = true;
        this.score = 25;
    }
    EnforcerBullet.prototype.mover = function (context, time) {
        this.advanceFrame(time, 100);
        this.move(time);
        if (this.onEdge && Math.random() < .01) {
            this.game.removeSprite(this);
        }
    };
    // override - hug wall
    EnforcerBullet.prototype.adjustMoveDelta = function (deltaX, deltaY) {
        if ((this.left + this.width + deltaX > this.game.right) || (this.left + deltaX < this.game.left)) {
            this.velocityX = 0;
            this.velocityY = (Math.random() < .5) ? this.speed : -this.speed;
            deltaX = 0;
            this.onEdge = true;
        }
        else if (this.top + this.height + deltaY > this.game.bottom || (this.top + deltaY < this.game.top)) {
            this.velocityY = 0;
            this.velocityX = (Math.random() < .5) ? this.speed : -this.speed;
            deltaY = 0;
            this.onEdge = true;
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