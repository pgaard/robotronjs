var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CruiseMissile = (function (_super) {
    __extends(CruiseMissile, _super);
    function CruiseMissile(game, left, top, manPosition, rgbColors) {
        _super.call(this, 'cruisemissile', game, left, top);
        this.manPosition = manPosition;
        this.rgbColors = rgbColors;
        this.canKill = true;
        this.enemy = true;
        this.width = 5;
        this.height = 5;
        this.front = { x: left, y: top };
        this.middle = { x: left, y: top };
        this.setRandomVelocity(this.front);
    }
    CruiseMissile.prototype.move = function (time) {
        if (Math.abs(this.front.x - this.middle.x) > CruiseMissile.distanceHorizontal || Math.abs(this.front.y - this.middle.y) > CruiseMissile.distanceVertical) {
            this.advanceMissle();
        }
        var deltaX = this.game.pixelsPerFrame(time, this.velocityX);
        var deltaY = this.game.pixelsPerFrame(time, this.velocityY);
        this.front.x += deltaX;
        this.front.y += deltaY;
        this.top = this.front.y;
        this.left = this.front.x;
        if (this.end) {
            var deltaX = this.game.pixelsPerFrame(time, this.velocityEndX);
            var deltaY = this.game.pixelsPerFrame(time, this.velocityEndY);
            this.end.x += deltaX;
            this.end.y += deltaY;
        }
    };
    CruiseMissile.prototype.mover = function (context, time) {
        this.move(time);
    };
    CruiseMissile.prototype.painter = function (context) {
        context.save();
        context.beginPath();
        context.strokeStyle = this.rgbColors();
        context.lineWidth = this.width;
        context.moveTo(this.front.x, this.front.y);
        context.lineTo(this.middle.x, this.middle.y);
        if (this.end)
            context.lineTo(this.end.x, this.end.y);
        context.stroke();
        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(this.front.x, this.front.y);
        var len = this.game.distance(this.front.x, this.front.y, this.middle.x, this.middle.y);
        var ratio = this.width / len;
        context.lineTo(this.front.x + (this.front.x - this.middle.x) * ratio, this.front.y + (this.front.y - this.middle.y) * ratio);
        context.stroke();
        context.restore();
    };
    CruiseMissile.prototype.setRandomVelocity = function (start) {
        var man = this.manPosition();
        var random = Math.random();
        var vertical = random > .3;
        var horizontal = random < .7;
        if (vertical) {
            if (start.y <= man.top)
                this.velocityY = CruiseMissile.velocityVertical;
            else
                this.velocityY = -CruiseMissile.velocityVertical;
        }
        else {
            this.velocityY = 0;
        }
        if (horizontal) {
            if (start.x <= man.left)
                this.velocityX = CruiseMissile.velocityHorizontal;
            else
                this.velocityX = -CruiseMissile.velocityHorizontal;
        }
        else {
            this.velocityX = 0;
        }
    };
    CruiseMissile.prototype.advanceMissle = function () {
        this.end = { x: this.middle.x, y: this.middle.y };
        this.middle.x = this.front.x;
        this.middle.y = this.front.y;
        this.velocityEndX = this.velocityX;
        this.velocityEndY = this.velocityY;
        this.setRandomVelocity(this.front);
    };
    CruiseMissile.prototype.kill = function (bullet) {
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        this.game.removeSprite(this);
    };
    CruiseMissile.distanceHorizontal = 40;
    CruiseMissile.distanceVertical = 20;
    CruiseMissile.velocityHorizontal = 200;
    CruiseMissile.velocityVertical = 100;
    return CruiseMissile;
})(RobotronSprite);
//# sourceMappingURL=cruisemissile.js.map