var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Quark = (function (_super) {
    __extends(Quark, _super);
    function Quark(game, left, top) {
        _super.call(this, 'quark', game, left, top, "all", Quark.cells);
        this.spawns = 0;
        this.speed = 150;
        this.width = Quark.cells['all'][0].w * 2;
        this.height = Quark.cells['all'][0].h * 2;
        this.enemy = true;
        this.canKill = true;
        this.mustKill = true;
        this.score = 1000;
        this.setDirectionQuark();
        this.startTime = getTimeNow();
    }
    Quark.prototype.mover = function (context, time) {
        this.advanceFrame(time, 25);
        if (Math.random() < .005)
            this.setDirectionQuark();
        // after 5 sec spawn 4 enforcers at random interval
        if ((getTimeNow() - this.startTime > 5000) && Math.random() < 0.01) {
            new Enforcer(this.game, this.left, this.top);
            this.game.playSound("sound_enforcerbirth");
            this.spawns++;
            if (this.spawns == 3) {
                this.game.removeSprite(this);
            }
        }
        this.move(time);
    };
    Quark.random45degreeAngle = function () {
        return 2 * Math.PI * ((Math.round(Math.random() * 4) / 4) + .125);
    };
    // override
    Quark.prototype.setDirectionQuark = function () {
        var theta = Quark.random45degreeAngle();
        this.velocityX = Math.cos(theta) * this.speed;
        this.velocityY = Math.sin(theta) * this.speed;
    };
    Quark.prototype.kill = function (bullet) {
        bullet.game.playSound("sound_spheroidkill");
        this.game.removeSprite(this);
        this.game.addSprite(new Bonus(this.game, this.left, this.top, "1000"));
    };
    Quark.cells = {
        all: [
            { x: 241 + 42 * 0, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 1, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 2, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 3, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 4, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 5, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 6, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 7, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 8, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 7, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 6, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 5, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 4, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 3, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 2, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 1, y: 235, w: 30, h: 30 }
        ]
    };
    return Quark;
})(RobotronSprite);
//# sourceMappingURL=quark.js.map