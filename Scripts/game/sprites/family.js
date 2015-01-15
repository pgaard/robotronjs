///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Family = (function (_super) {
    __extends(Family, _super);
    function Family(name, game, left, top, cells) {
        _super.call(this, name, game, left, top, "left", cells);
        this.speed = 20;
        this.setRandomDirection();
    }
    Family.prototype.mover = function (context, time) {
        this.advanceFrame(time, 200);
        if (Math.random() < .005)
            this.setRandomDirection();
        this.move(time, true);
    };
    return Family;
})(AnimatedSprite);
//# sourceMappingURL=family.js.map