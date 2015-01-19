var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Tank = (function (_super) {
    __extends(Tank, _super);
    function Tank(game, left, top) {
        _super.call(this, 'tank', game, left, top, "all", Tank.cells);
        this.speed = 50;
        this.width = Tank.cells['all'][0].w * 2;
        this.height = Tank.cells['all'][0].h * 2;
        this.enemy = true;
        this.mustKill = true;
        this.canKill = true;
        this.score = 200;
        this.setRandomDirection();
    }
    Tank.prototype.mover = function (context, time) {
        this.advanceFrame(time, 200);
        if (Math.random() < .005)
            this.setRandomDirection();
        this.move(time);
    };
    // override
    Tank.prototype.setRandomDirection = function () {
        var theta = Quark.random45degreeAngle();
        this.velocityX = Math.cos(theta) * this.speed;
        this.velocityY = Math.sin(theta) * this.speed;
    };
    Tank.prototype.kill = function (bullet) {
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        bullet.game.playSound("sound_kill");
        this.game.removeSprite(this);
    };
    Tank.cells = {
        all: [
            { x: 1, y: 275, w: 26, h: 32 },
            { x: 1 + 38, y: 275, w: 26, h: 32 },
            { x: 1 + 38 * 2, y: 275, w: 26, h: 32 },
            { x: 1 + 38 * 3, y: 275, w: 26, h: 32 }
        ]
    };
    return Tank;
})(RobotronSprite);
//# sourceMappingURL=tank.js.map