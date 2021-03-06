///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>
///<reference path="Enforcer.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="Bonus.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Spheroid = (function (_super) {
    __extends(Spheroid, _super);
    function Spheroid(game, left, top) {
        var _this = this;
        _super.call(this, 'spheroid', game, left, top, "all", Spheroid.cells);
        this.spawns = 0;
        this.speed = 200;
        this.width = Spheroid.cells['all'][0].w * 2;
        this.height = Spheroid.cells['all'][0].h * 2;
        this.enemy = true;
        this.canKill = true;
        this.mustKill = true;
        this.score = 1000;
        this.setDirectionSpheroid();
        this.queueRandomEvent(2, 0, true, function () { return _this.setDirectionSpheroid(); });
        this.queueRandomEvent(.5, 5, true, function () { return _this.spawnEnforcer(); });
    }
    Spheroid.prototype.mover = function (context, time) {
        this.advanceFrame(time, 25);
        this.fireRandomEvents();
        this.move(time);
    };
    Spheroid.prototype.spawnEnforcer = function () {
        new Enforcer(this.game, this.left, this.top);
        this.game.playSound("sound_enforcerbirth");
        this.spawns++;
        if (this.spawns == Spheroid.enforcersSpawned) {
            this.game.removeSprite(this);
        }
    };
    // override
    Spheroid.prototype.setDirectionSpheroid = function () {
        var theta = 2 * Math.PI * Math.random();
        this.velocityX = Math.cos(theta) * this.speed;
        this.velocityY = Math.sin(theta) * this.speed;
    };
    // override - hug walls
    Spheroid.prototype.adjustMoveDelta = function (deltaX, deltaY) {
        if ((this.left + this.width + deltaX > this.game.right) || (this.left + deltaX < this.game.left)) {
            this.velocityX = 0;
            this.velocityY = (Math.random() < .5) ? this.speed : -this.speed;
            deltaX = 0;
        }
        else if (this.top + this.height + deltaY > this.game.bottom || (this.top + deltaY < this.game.top)) {
            this.velocityY = 0;
            this.velocityX = (Math.random() < .5) ? this.speed : -this.speed;
            deltaY = 0;
        }
        return { deltaX: deltaX, deltaY: deltaY };
    };
    Spheroid.prototype.kill = function (bullet) {
        bullet.game.playSound("sound_spheroidkill");
        this.game.removeSprite(this);
        this.game.addSprite(new Bonus(this.game, this.left, this.top, "1000"));
    };
    Spheroid.enforcersSpawned = 4;
    Spheroid.cells = {
        all: [
            { x: 561 - 42 * 7, y: 81, w: 30, h: 30 },
            { x: 561 - 42 * 6, y: 81, w: 30, h: 30 },
            { x: 561 - 42 * 5, y: 81, w: 30, h: 30 },
            { x: 561 - 42 * 4, y: 81, w: 30, h: 30 },
            { x: 561 - 42 * 3, y: 81, w: 30, h: 30 },
            { x: 561 - 42 * 2, y: 81, w: 30, h: 30 },
            { x: 561 - 42, y: 81, w: 30, h: 30 },
            { x: 561, y: 81, w: 30, h: 30 },
            { x: 561 - 42, y: 81, w: 30, h: 30 },
            { x: 561 - 42 * 2, y: 81, w: 30, h: 30 },
            { x: 561 - 42 * 3, y: 81, w: 30, h: 30 },
            { x: 561 - 42 * 4, y: 81, w: 30, h: 30 },
            { x: 561 - 42 * 5, y: 81, w: 30, h: 30 },
            { x: 561 - 42 * 6, y: 81, w: 30, h: 30 },
        ]
    };
    return Spheroid;
})(RobotronSprite);
//# sourceMappingURL=spheroid.js.map