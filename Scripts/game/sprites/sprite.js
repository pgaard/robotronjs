///<reference path="../Game.ts" />
// generic sprite
var Sprite = (function () {
    // painter is an object with a method paint(sprint,context) that draws the sprite
    function Sprite(name, game, left, top) {
        this.enemy = false;
        if (name !== undefined)
            this.name = name;
        this.game = game;
        this.left = left;
        this.top = top;
        this.visible = true;
        this.animating = false;
    }
    Sprite.prototype.paint = function (context) {
        if (this.painter !== undefined && this.visible) {
            this.painter(context);
        }
    };
    Sprite.prototype.update = function (context, time) {
        if (!this.game.paused && !this.game.dead) {
            this.mover(context, time);
        }
    };
    Sprite.prototype.mover = function (context, time) {
    };
    Sprite.prototype.painter = function (context) {
    };
    return Sprite;
})();
//# sourceMappingURL=Sprite.js.map