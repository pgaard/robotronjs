///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Bonus = (function (_super) {
    __extends(Bonus, _super);
    function Bonus(game, left, top, type) {
        _super.call(this, 'bonus', game, left, top, type.toString(), Bonus.cells);
        this.type = type;
        this.width = 10 * 2;
        this.height = 18 * 2;
        this.startTime = getTimeNow();
        game.addSprite(this);
    }
    Bonus.prototype.mover = function (context, time) {
        if (getTimeNow() - this.startTime > 2500)
            this.game.removeSprite(this);
    };
    Bonus.cells = {
        "1000": [{ x: 37, y: 1, w: 20, h: 10 }],
        "2000": [{ x: 37 + 1 * 34, y: 1, w: 20, h: 10 }],
        "3000": [{ x: 37 + 2 * 34, y: 1, w: 20, h: 10 }],
        "4000": [{ x: 37 + 3 * 34, y: 1, w: 20, h: 10 }],
        "5000": [{ x: 37 + 4 * 34, y: 1, w: 20, h: 10 }]
    };
    return Bonus;
})(AnimatedSprite);
//# sourceMappingURL=Bonus.js.map