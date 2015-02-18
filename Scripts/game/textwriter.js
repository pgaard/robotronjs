var TextWriter = (function () {
    function TextWriter(context, spriteSheet) {
        this.context = context;
        this.spriteSheet = spriteSheet;
        if (!TextWriter.images) {
            TextWriter.images = [];
            for (var i = 0; i < 25; i++) {
                var extra = (i > 22) ? 4 : 0;
                TextWriter.images.push({
                    x: TextWriter.spriteStartPosRow1.x + i * TextWriter.spriteIntervalX + extra,
                    y: TextWriter.spriteStartPosRow1.y,
                    w: i == 22 ? 10 : 6,
                    h: 10
                });
            }
            for (var i = 0; i < 11; i++) {
                var extra = (i > 7) ? 4 : 0;
                TextWriter.images.push({
                    x: TextWriter.spriteStartPosRow2.x + i * TextWriter.spriteIntervalX + extra,
                    y: TextWriter.spriteStartPosRow2.y,
                    w: i == 7 ? 10 : 6,
                    h: 10
                });
            }
            TextWriter.images.push({ x: 346, y: 164, w: 15, h: 22 });
        }
    }
    TextWriter.prototype.write = function (text, x, y, scale) {
        if (scale === void 0) { scale = 1; }
        var index;
        var pos = 0;
        for (var i = 0; i < text.length; i++) {
            var space = false;
            var imageScale = scale;
            var letter = text.charCodeAt(i);
            if (letter >= 48 && letter <= 57) {
                index = letter - 48;
            }
            else if (letter >= 97 && letter <= 122) {
                index = letter - 97 + 10;
            }
            else if (letter == 33) {
                index = 36;
                imageScale = scale / 2;
            }
            else {
                pos += (6 * scale);
                continue;
            }
            var image = TextWriter.images[index];
            this.context.drawImage(this.spriteSheet, image.x, image.y, image.w, image.h, x + pos, y, image.w * imageScale, image.h * imageScale);
            pos += ((image.w + 2) * imageScale);
        }
    };
    TextWriter.spriteStartPosRow1 = { x: 153, y: 275 };
    TextWriter.spriteStartPosRow2 = { x: 1, y: 317 };
    TextWriter.spriteIntervalX = 18;
    TextWriter.spriteSize = { x: 6, y: 10 };
    return TextWriter;
})();
//# sourceMappingURL=textwriter.js.map