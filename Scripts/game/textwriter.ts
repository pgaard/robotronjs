class TextWriter {
    static smallStartPosRow1 = { x: 153, y: 275 }; 
    static smallStartPosRow2 = { x: 1, y: 317 }; 
    static smallIntervalX = 18;
    static smallSize = { x: 6, y: 10 };
    static smallCells: { x: number; y: number; w: number; h: number }[];

    static largeStartPosRow1 = { x: 239, y: 317 };
    static largeStartPosRow2 = { x: 1, y: 339 };
    static largeIntervalX = 22;
    static largeSize = { x: 10, y: 12 };
    static largeCells: { x: number; y: number; w: number; h: number }[];

    constructor(private context: CanvasRenderingContext2D, private spriteSheet: HTMLImageElement) {
        if (!TextWriter.smallCells) {
            TextWriter.smallCells = [];
            // 0 - 9 a - o
            for (var i = 0; i < 25; i++) {
                var extra = (i > 22) ? 4 : 0
                TextWriter.smallCells.push({
                    x: TextWriter.smallStartPosRow1.x + i * TextWriter.smallIntervalX + extra,
                    y: TextWriter.smallStartPosRow1.y,
                    w: i == 22 ? 10 : 6,
                    h: TextWriter.smallSize.y
                });
            }
            // p - z
            for (var i = 0; i < 11; i++) {
                var extra = (i > 7) ? 4 : 0
                TextWriter.smallCells.push({
                    x: TextWriter.smallStartPosRow2.x + i * TextWriter.smallIntervalX + extra,
                    y: TextWriter.smallStartPosRow2.y,
                    w: i == 7 ? 10 : 6,
                    h: TextWriter.smallSize.y
                });
            }

            TextWriter.smallCells.push({x: 346, y: 164, w: 15, h: 22});
        }

        if (!TextWriter.largeCells) {
            TextWriter.largeCells = [];
            // 0 - 9 a - o
            for (var i = 0; i < 17; i++) {
                TextWriter.largeCells.push({
                    x: TextWriter.largeStartPosRow1.x + i * TextWriter.largeIntervalX ,
                    y: TextWriter.largeStartPosRow1.y,
                    w: TextWriter.largeSize.x,
                    h: TextWriter.largeSize.y
                });
            }
            // p - z
            for (var i = 0; i < 19; i++) {
                TextWriter.largeCells.push({
                    x: TextWriter.largeStartPosRow2.x + i * TextWriter.largeIntervalX,
                    y: TextWriter.largeStartPosRow2.y,
                    w: TextWriter.largeSize.x,
                    h: TextWriter.largeSize.y
                });
            }

            TextWriter.largeCells.push({ x: 346, y: 164, w: 15, h: 22 });
        }
    }

    write(text: string, x: number, y: number, scale: number = 1, large = true) {
        var index: number;
        var cells = large ? TextWriter.largeCells : TextWriter.smallCells;
        var pos = 0;
        for (var i = 0; i < text.length; i++) {
            var space = false;
            var imageScale = scale;           
            var letter = text.charCodeAt(i);
            if (letter >= 48 && letter <= 57) {
                index = letter - 48;
            } else if (letter >= 97 && letter <= 122) {
                index = letter - 97 + 10;
            } else if (letter == 33) { // ! draws man icon
                index = 36;
                imageScale = scale / 2;
            }
            else {
                pos += (6 * scale);
                continue;
            }

            var image = cells[index];
            this.context.drawImage(
                this.spriteSheet,
                image.x,
                image.y,
                image.w,
                image.h,
                x + pos,
                y,
                image.w * imageScale,
                image.h * imageScale);
            pos += ((image.w + 2) * imageScale);
        }
    }    
} 