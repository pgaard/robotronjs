var Bonus = AnimatedSprite.extend({
    init: function (game, left, top, type) {
        this._super('bonus', game, left, top, this.bonusClear, type.toString());
        this.type = type;
        this.hit = 0;
        this.width = 10 * 2;
        this.height = 18 * 2;
        this.startTime = getTimeNow();
        game.addSprite(this);
    },
    bonusClear : {
        execute: function(sprite, context, time){
            if(getTimeNow() - sprite.startTime > 2500)
                sprite.game.removeSprite(sprite);
        }
    },
    cells:{
        "1000":[{x:37, y:1, w:20, h:10}],
        "2000":[{x:37+1*34, y:1, w:20, h:10}],
        "3000":[{x:37+2*34, y:1, w:20, h:10}],
        "4000":[{x:37+3*34, y:1, w:20, h:10}],
        "5000":[{x:37+4*34, y:1, w:20, h:10}]
    }
});
