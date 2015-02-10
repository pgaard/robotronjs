var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TankShot = (function (_super) {
    __extends(TankShot, _super);
    function TankShot(game, left, top, shootX, shootY, rgbColors) {
        _super.call(this, 'tankshot', game, left, top);
        this.velocityX = shootX * TankShot.bulletSpeed;
        this.velocityY = shootY * TankShot.bulletSpeed;
        this.canKill = true;
        this.enemy = true;
        this.width = this.height = TankShot.radius * 2;
    }
    TankShot.prototype.painter = function (context) {
        context.save();
        context.beginPath();
        context.arc(this.left + TankShot.radius, this.top - TankShot.radius, TankShot.radius, 0, Math.PI * 2, false);
        context.fillStyle = RobotronSprite.rgbColors();
        context.lineWidth = 2;
        context.strokeStyle = 'white';
        context.fill();
        context.stroke();
        context.restore();
    };
    TankShot.prototype.mover = function (context, time) {
        this.move(time);
    };
    TankShot.prototype.adjustMoveDelta = function (deltaX, deltaY) {
        if (this.left + deltaX > this.game.right || this.left + deltaX < this.game.left || this.top + deltaY > this.game.bottom || this.top + deltaY < this.game.top) {
            this.game.removeSprite(this);
        }
        return { deltaX: deltaX, deltaY: deltaY };
    };
    TankShot.prototype.kill = function (bullet) {
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        //TODO: sound
        this.game.removeSprite(this);
    };
    TankShot.bulletSpeed = 400;
    TankShot.radius = 10;
    return TankShot;
})(RobotronSprite);
//# sourceMappingURL=tankshot.js.map