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
        this.dissapearing = false;
        this.velocityX = shootX * TankShot.bulletSpeed;
        this.velocityY = shootY * TankShot.bulletSpeed;
        this.canKill = true;
        this.enemy = true;
        this.width = this.height = TankShot.radius * 2;
    }
    TankShot.prototype.painter = function (context) {
        context.save();
        context.beginPath();
        context.arc(this.left + TankShot.radius, this.top + TankShot.radius, TankShot.radius, 0, Math.PI * 2, false);
        context.fillStyle = RobotronSprite.rgbColors();
        context.lineWidth = 2;
        context.strokeStyle = 'white';
        context.fill();
        context.stroke();
        context.beginPath();
        context.arc(this.left + TankShot.radius, this.top + TankShot.radius, TankShot.radius - 2, 0, Math.PI * 2, false);
        context.strokeStyle = 'black';
        context.stroke();
        context.restore();
    };
    TankShot.prototype.mover = function (context, time) {
        this.move(time);
        this.fireRandomEvents();
    };
    TankShot.prototype.checkDissapear = function () {
        var _this = this;
        if (!this.dissapearing) {
            this.dissapearing = true;
            this.queueRandomEvent(2, .5, false, function () {
                _this.game.removeSprite(_this);
            });
        }
    };
    TankShot.prototype.adjustMoveDelta = function (deltaX, deltaY) {
        if (this.left + deltaX + this.width > this.game.right) {
            this.velocityX = -Math.abs(this.velocityX);
            deltaX = -Math.abs(deltaX);
            this.checkDissapear();
        }
        else if (this.left + deltaX < this.game.left) {
            this.velocityX = Math.abs(this.velocityX);
            deltaX = Math.abs(deltaX);
            this.checkDissapear();
        }
        else if (this.top + deltaY + this.height > this.game.bottom) {
            this.velocityY = -Math.abs(this.velocityY);
            deltaY = -Math.abs(deltaY);
            this.checkDissapear();
        }
        else if (this.top + deltaY < this.game.top) {
            this.velocityY = Math.abs(this.velocityY);
            deltaY = Math.abs(deltaY);
            this.checkDissapear();
        }
        return { deltaX: deltaX, deltaY: deltaY };
    };
    TankShot.prototype.kill = function (bullet) {
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        //TODO: sound
        this.game.removeSprite(this);
    };
    TankShot.bulletSpeed = 500;
    TankShot.radius = 10;
    return TankShot;
})(RobotronSprite);
//# sourceMappingURL=tankshot.js.map