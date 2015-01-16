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
    }
    CruiseMissile.prototype.mover = function (context, time) {
        var man = this.manPosition();
        //var deltaX = this.game.pixelsPerFrame(time, this.velocityX);
        //var deltaY = this.game.pixelsPerFrame(time, this.velocityY);
    };
    CruiseMissile.prototype.painter = function (context) {
        context.save();
        context.beginPath();
        context.strokeStyle = 'white';
        context.lineWidth = 5;
        context.moveTo(this.point1.x, this.point1.y);
        context.lineTo(this.point2.x, this.point2.y);
        if (this.point3)
            context.lineTo(this.point3.x, this.point3.y);
        context.stroke();
        context.restore();
    };
    return CruiseMissile;
})(RobotronSprite);
//# sourceMappingURL=cruisemissile.js.map