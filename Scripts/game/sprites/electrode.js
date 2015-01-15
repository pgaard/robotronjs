///<reference path="../Game.ts"/>
///<reference path="sprite.ts"/>
///<reference path="bullet.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Electrode = (function (_super) {
    __extends(Electrode, _super);
    function Electrode(game, left, top, rgbColors) {
        _super.call(this, 'electrode', game, left, top);
        this.hit = false;
        this.width = 10 * 2;
        this.height = 18 * 2;
        this.enemy = true;
        this.rgbColors = rgbColors;
        this.canKill = true;
        game.addSprite(this);
    }
    Electrode.prototype.painter = function (context) {
        context.save();
        context.fillStyle = this.rgbColors();
        context.fillRect(this.left, this.top, this.width, this.height);
        context.restore();
    };
    Electrode.prototype.kill = function (bullet) {
        this.game.playSound("sound_kill");
        this.hit = true;
    };
    Electrode.prototype.mover = function (context, time) {
        if (this.hit) {
            this.width -= 1;
            this.height -= 1;
            if (this.height == 0 || this.width == 0) {
                this.game.removeSprite(this);
            }
        }
    };
    return Electrode;
})(Sprite);
//# sourceMappingURL=Electrode.js.map