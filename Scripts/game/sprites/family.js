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
        var _this = this;
        _super.call(this, name, game, left, top, "left", cells);
        this.speed = 20;
        this.setRandomDirection();
        this.queueRandomEvent(2, 0, true, function () { return _this.setRandomDirection(); });
    }
    Family.prototype.mover = function (context, time) {
        this.advanceFrame(time, 200);
        this.fireRandomEvents();
        this.move(time);
    };
    return Family;
})(RobotronSprite);
//# sourceMappingURL=family.js.map