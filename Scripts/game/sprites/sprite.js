var Sprite = Class.extend({
    // painter is an object with a method paint(sprint,context) that draws the sprite
    init: function(name, painter, behaviors, game, top, left) {
        if (name !== undefined) this.name = name;
        if (painter !== undefined) this.painter = painter;
        this.game = game;
        this.left = left;
        this.top = top;
        this.height = 10;
        this.velocityX = 0;
        this.velocityY = 0;
        this.visible = true;
        this.animating = false;
        this.behaviors = behaviors || [];
    },
    
    paint: function (context) {
        if (this.painter !== undefined && this.visible) {
            this.painter.paint(this, context);
        }
    },
    
    update: function (context, time) {
        if (!this.game.paused && !this.game.dead) {
            for (var i = 0; i < this.behaviors.length; ++i) {
                this.behaviors[i].execute(this, context, time);
            }
        }
    }    
});