
var explosionPainter = {
    paint: function (sprite, context) {
        context.save();
        context.strokeStyle = 'white';

        if (!sprite.spacing)
            sprite.spacing = 1;

        var middleX = sprite.left + sprite.width / 2;
        var middleY = sprite.top + sprite.height / 2;
        var halfHeight = sprite.height / 2;
        var halfWidth = sprite.width / 2;
        var explosionWidth = Math.max(1, sprite.spacing / 4);
        context.lineWidth = 2;
        
        if (sprite.horizontal) {

            for (var x = middleX - halfWidth * sprite.spacing; x < middleX + halfWidth * sprite.spacing; x += sprite.spacing) {
                context.beginPath();                
                context.moveTo(x, middleY - halfHeight / explosionWidth);
                context.lineTo(x, middleY + halfHeight / explosionWidth);
                context.stroke();
            }
        } else {

            for (var y = middleY - halfHeight * sprite.spacing; y < middleY + halfHeight * sprite.spacing; y += sprite.spacing) {
                context.beginPath();
                context.moveTo(middleX - halfWidth / explosionWidth, y);
                context.lineTo(middleX + halfWidth / explosionWidth, y);
                context.stroke();
            }
        }

        context.restore();
    }
};

var explosionMover = {
    execute: function (sprite, context, time) {
        if (!game.paused && !game.dead) {
            sprite.spacing += .5;
            if (sprite.spacing > 10) {
                game.removeSprite(sprite);
                return;
            }
        }
    }
};