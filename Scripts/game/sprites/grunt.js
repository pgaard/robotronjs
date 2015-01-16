///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="Explosion.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Grunt = (function (_super) {
    __extends(Grunt, _super);
    function Grunt(game, left, top, waveDuration, manPosition) {
        _super.call(this, 'grunt', game, left, top, 'all', Grunt.cells);
        this.width = 14 * 2;
        this.height = 22 * 2;
        this.enemy = true;
        this.canKill = true;
        this.mustKill = true;
        this.score = 100;
        this.waveDuration = waveDuration;
        this.manPosition = manPosition;
    }
    Grunt.prototype.mover = function (context, time) {
        // speed up during wave
        var speed = 50 + (this.waveDuration() ? (this.waveDuration() * 0.004) : 1);
        this.advanceFrame(time, 75);
        // move straight towards man
        var man = this.manPosition();
        var theta = Math.atan((this.top - man.top) / (this.left - man.left));
        var reverse = this.left > man.left ? -1 : 1;
        this.velocityX = Math.cos(theta) * speed * reverse;
        this.velocityY = Math.sin(theta) * speed * reverse;
        this.move(time);
    };
    Grunt.prototype.kill = function (bullet) {
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        bullet.game.playSound("sound_kill");
        this.game.removeSprite(this);
    };
    Grunt.cells = {
        all: [
            { x: 150, y: 234, w: 19, h: 27 },
            { x: 180, y: 234, w: 19, h: 27 },
            { x: 210, y: 234, w: 19, h: 27 }
        ]
    };
    return Grunt;
})(RobotronSprite);
//# sourceMappingURL=Grunt.js.map