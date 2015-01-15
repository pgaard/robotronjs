///<reference path="../Game.ts"/>
///<reference path="sprite.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Explosion = (function (_super) {
    __extends(Explosion, _super);
    function Explosion(game, left, top, width, height, horizontal) {
        _super.call(this, 'explosion', game, left, top);
        this.height = height;
        this.width = width;
        this.horizontal = horizontal;
        this.spacing = 1;
        game.addSprite(this);
    }
    Explosion.prototype.painter = function (context) {
        context.save();
        context.strokeStyle = 'white';
        var middleX = this.left + this.width / 2;
        var middleY = this.top + this.height / 2;
        var halfHeight = this.height / 2;
        var halfWidth = this.width / 2;
        var explosionWidth = Math.max(1, this.spacing / 4);
        context.lineWidth = 2;
        if (this.horizontal) {
            for (var x = middleX - halfWidth * this.spacing; x < middleX + halfWidth * this.spacing; x += this.spacing) {
                context.beginPath();
                context.moveTo(x, middleY - halfHeight / explosionWidth);
                context.lineTo(x, middleY + halfHeight / explosionWidth);
                context.stroke();
            }
        }
        else {
            for (var y = middleY - halfHeight * this.spacing; y < middleY + halfHeight * this.spacing; y += this.spacing) {
                context.beginPath();
                context.moveTo(middleX - halfWidth / explosionWidth, y);
                context.lineTo(middleX + halfWidth / explosionWidth, y);
                context.stroke();
            }
        }
        context.restore();
    };
    Explosion.prototype.mover = function (context, time) {
        this.spacing += .5;
        if (this.spacing > 10) {
            this.game.removeSprite(this);
            return;
        }
    };
    return Explosion;
})(Sprite);
//# sourceMappingURL=Explosion.js.map