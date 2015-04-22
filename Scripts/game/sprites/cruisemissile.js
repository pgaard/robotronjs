var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CruiseMissile = (function (_super) {
    __extends(CruiseMissile, _super);
    function CruiseMissile(game, left, top, manPosition) {
        _super.call(this, 'cruisemissile', game, left, top);
        this.manPosition = manPosition;
        this.canKill = true;
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
    };
    CruiseMissile.prototype.mover = function (context, time) {
        this.move(time);
    };
    CruiseMissile.prototype.painter = function (context) {
        context.save();
        context.beginPath();
        context.strokeStyle = 'white';
        context.lineWidth = 5;
        context.moveTo(this.front.x, this.front.y);
        context.lineTo(this.middle.x, this.middle.y);
        if (this.end)
            context.lineTo(this.end.x, this.end.y);
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
        if (this.velocityX == 0 && this.velocityY == 0) {
            console.log("o vel");
        }
    };
    CruiseMissile.prototype.advanceMissle = function () {
        this.middle.x = this.front.x;
        this.middle.y = this.front.y;
        this.setRandomVelocity(this.front);
    };
    CruiseMissile.distanceHorizontal = 40;
    CruiseMissile.distanceVertical = 20;
    CruiseMissile.velocityHorizontal = 100;
    CruiseMissile.velocityVertical = 50;
    return CruiseMissile;
})(RobotronSprite);
//# sourceMappingURL=cruisemissile.js.map