///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Skull = (function (_super) {
    __extends(Skull, _super);
    function Skull(game, left, top) {
        _super.call(this, 'skull', game, left, top, 'all', Skull.cells);
        this.startTime = getTimeNow();
    }
    Skull.prototype.mover = function (context, time) {
        if ((getTimeNow() - this.startTime) > 1500)
            this.game.removeSprite(this);
    };
    Skull.cells = {
        all: [
            { x: 1, y: 1, w: 22, h: 22 }
        ]
    };
    return Skull;
})(RobotronSprite);
//# sourceMappingURL=skull.js.map