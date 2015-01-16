///<reference path="../Game.ts"/>
///<reference path="Sprite.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(game, left, top, shootX, shootY, rgbColors) {
        _super.call(this, 'bullet', game, left, top);
        this.rgbColors = rgbColors;
        this.bulletSpeed = 1000;
        this.velocityX = shootX * this.bulletSpeed;
        this.velocityY = shootY * this.bulletSpeed;
        this.bulletLength = 10;
        this.canKill = true;
        game.addSprite(this);
    }
    Bullet.prototype.painter = function (context) {
        context.save();
        context.beginPath();
        context.strokeStyle = this.rgbColors();
        var bulletX = 0, bulletY = 0;
        if (this.velocityX > 0)
            bulletX = this.bulletLength;
        else if (this.velocityX < 0)
            bulletX = -this.bulletLength;
        if (this.velocityY > 0)
            bulletY = this.bulletLength;
        else if (this.velocityY < 0)
            bulletY = -this.bulletLength;
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(this.left - bulletX, this.top - bulletY);
        context.lineTo(this.left + bulletX, this.top + bulletY);
        context.stroke();
        context.restore();
    };
    Bullet.prototype.mover = function (context, time) {
        var deltaX = this.game.pixelsPerFrame(time, this.velocityX);
        var deltaY = this.game.pixelsPerFrame(time, this.velocityY);
        if (this.left + deltaX > this.game.right || this.left + deltaX < this.game.left || this.top + deltaY > this.game.bottom || this.top + deltaY < this.game.top) {
            this.game.removeSprite(this);
            return;
        }
        this.left += deltaX;
        this.top += deltaY;
    };
    return Bullet;
})(RobotronSprite);
//# sourceMappingURL=bullet.js.map