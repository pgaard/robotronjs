// spritesheet is an Image object containing sprite framges
// cells in array of objects with { left,top,width,height } for each frame in spritesheet
SpriteSheetPainter = function (cells, spritesheet, startDirection, scale) {
    this.cells = cells;
    this.cellIndex = 0;
    this.spritesheet = spritesheet;
    this.currentDirection = startDirection;
    this.scale = scale ? scale : 1;
};

SpriteSheetPainter.prototype = {
    advance: function (direction) {
        if (direction != this.currentDirection)
            this.cellIndex = 0;
        this.currentDirection = direction;
        if (this.cellIndex == this.cells[direction].length - 1) {
            this.cellIndex = 0;
        }
        else {
            this.cellIndex++;
        }
    },
    paint: function (sprite, context) {
        var cell = this.cells[this.currentDirection][this.cellIndex];
        context.drawImage(this.spritesheet, cell.x, cell.y, cell.w, cell.h,
            sprite.left, sprite.top, cell.w * this.scale, cell.h * this.scale);
    }
};