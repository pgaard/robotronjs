///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>
///<reference path="Explosion.ts"/>
///<reference path="EnforcerBullet.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Enforcer = (function (_super) {
    __extends(Enforcer, _super);
    function Enforcer(game, left, top) {
        var _this = this;
        _super.call(this, 'enforcer', game, left, top, 'all', Enforcer.cells);
        this.width = 18 * 2;
        this.height = 22 * 2;
        this.enemy = true;
        this.canKill = true;
        this.mustKill = true;
        this.score = 150;
        this.speed = 200;
        this.setRandomDirectionEnforcer();
        this.queueRandomEvent(4, 1, true, function () { return _this.setRandomDirectionEnforcer(); });
        this.queueRandomEvent(3, 1, true, function () { return _this.shootAtPlayer(); });
    }
    Enforcer.prototype.mover = function (context, time) {
        this.advanceFrame(time, 200, true); // just grows and stops animating
        this.fireRandomEvents();
        this.move(time);
    };
    Enforcer.prototype.shootAtPlayer = function () {
        var man = RobotronSprite.getMan();
        var distance = this.game.distance(this.left, this.top, man.left, man.top);
        var bulletSpeed = (distance / this.game.width()) * 600;
        var theta = Math.atan((this.top - man.top) / (this.left - man.left));
        var reverse = this.left > man.left ? -1 : 1;
        var velocityX = Math.cos(theta) * bulletSpeed * reverse;
        var velocityY = Math.sin(theta) * bulletSpeed * reverse;
        var bullet = new EnforcerBullet(this.game, this.left, this.top, velocityX, velocityY);
        bullet.speed = bulletSpeed;
        this.game.playSound("sound_enforcershot");
    };
    // override
    Enforcer.prototype.setRandomDirectionEnforcer = function () {
        this.speed = (Math.random() * 150) + 25;
        var theta = 2 * Math.PI * Math.random();
        this.velocityX = Math.cos(theta) * this.speed;
        this.velocityY = Math.sin(theta) * this.speed;
    };
    Enforcer.prototype.kill = function (bullet) {
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        bullet.game.playSound("sound_kill");
        this.game.removeSprite(this);
    };
    Enforcer.cells = {
        all: [
            { x: 1 + 30 * 1, y: 123, w: 18, h: 22 },
            { x: 1 + 30 * 2, y: 123, w: 18, h: 22 },
            { x: 1 + 30 * 3, y: 123, w: 18, h: 22 },
            { x: 1 + 30 * 4, y: 123, w: 18, h: 22 },
            { x: 1 + 30 * 5, y: 123, w: 18, h: 22 },
            { x: 1, y: 123, w: 18, h: 22 }
        ]
    };
    return Enforcer;
})(RobotronSprite);
//# sourceMappingURL=enforcer.js.map