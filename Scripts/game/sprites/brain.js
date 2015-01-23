///<reference path="../Game.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="Explosion.ts"/>
///<reference path="AnimatedSprite.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Brain = (function (_super) {
    __extends(Brain, _super);
    function Brain(game, left, top) {
        _super.call(this, 'brain', game, left, top, "left", Brain.cells);
        this.speed = 50;
        this.width = Brain.cells['left'][0].w * 2;
        this.height = Brain.cells['left'][0].h * 2;
        this.enemy = true;
        this.canKill = true;
        this.mustKill = true;
        this.score = 500;
        this.setRandomDirection();
        this.queueRandomEvent(3, 1, true, this.setRandomDirection);
    }
    // TODO: random changing movement towards player, towards family or random
    Brain.prototype.mover = function (context, time) {
        this.advanceFrame(time, 200);
        this.fireRandomEvents();
        this.move(time);
    };
    Brain.prototype.kill = function (bullet) {
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(this.game, this.left, this.top, this.width, this.height, horizontal);
        this.game.playSound("sound_kill");
        this.game.removeSprite(this);
    };
    Brain.cells = {
        left: [
            { x: 321, y: 123, w: 22, h: 30 },
            { x: 321 + 38, y: 123, w: 22, h: 30 },
            { x: 321, y: 123, w: 22, h: 30 },
            { x: 321 + 38 * 2, y: 123, w: 22, h: 30 }
        ],
        right: [
            { x: 321 + 38 * 3, y: 123, w: 22, h: 30 },
            { x: 321 + 38 * 4, y: 123, w: 22, h: 30 },
            { x: 321 + 38 * 3, y: 123, w: 22, h: 30 },
            { x: 321 + 38 * 5, y: 123, w: 22, h: 30 }
        ],
        up: [
            { x: 1 + 38 * 2, y: 165, w: 26, h: 30 },
            { x: 1 + 38 * 3, y: 165, w: 26, h: 32 },
            { x: 1 + 38 * 4, y: 165, w: 26, h: 30 },
            { x: 1 + 38 * 3, y: 165, w: 26, h: 32 }
        ],
        down: [
            { x: 547, y: 123, w: 26, h: 30 },
            { x: 1, y: 165, w: 26, h: 32 },
            { x: 1 + 38, y: 165, w: 26, h: 32 },
            { x: 1, y: 165, w: 26, h: 32 }
        ]
    };
    return Brain;
})(RobotronSprite);
//# sourceMappingURL=brain.js.map