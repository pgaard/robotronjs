var ImagePainter = function (imageUrl: string) {
    this.image = new Image();
    this.image.src = imageUrl;
};

ImagePainter.prototype = {
    paint: function (sprite: Sprite, context: CanvasRenderingContext2D) {
        if (this.image.complete) {
            context.drawImage(this.image, sprite.left, sprite.top,
                sprite.width, sprite.height);
        }
    }
};