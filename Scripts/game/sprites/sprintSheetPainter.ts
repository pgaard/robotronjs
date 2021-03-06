﻿///<reference path="sprite.ts" />

// spritesheet is an Image object containing sprite framges
// cells in array of objects with { left,top,width,height } for each frame in spritesheet
class SpriteSheetPainter
{
    cells: ISpriteCells;
    cellIndex: number;
    spritesheet: HTMLImageElement;
    currentDirection: string;
    scale: number;

    constructor(cells: ISpriteCells, spritesheet: HTMLImageElement, startDirection: string, scale: number) {
        this.cells = cells;
        this.cellIndex = 0;
        this.spritesheet = spritesheet;
        this.currentDirection = startDirection;
        this.scale = scale ? scale : 1;
    }
    advance(direction: string, oneShot: boolean) {
        if (direction != this.currentDirection)
            this.cellIndex = 0;
        this.currentDirection = direction;
        if (this.cellIndex == this.cells[direction].length - 1) {
            if(!oneShot ) this.cellIndex = 0;
        }
        else {
            this.cellIndex++;
        }
    }
    paint(sprite: Sprite, context: CanvasRenderingContext2D) {
        var cell = this.cells[this.currentDirection][this.cellIndex];        

        context.drawImage(this.spritesheet, cell.x, cell.y, cell.w, cell.h,
            sprite.left, sprite.top, cell.w * this.scale, cell.h * this.scale);
          
          /*
        context.fillStyle = 'red'; // 
        context.globalCompositeOperation = "source-in";
        context.fillRect(sprite.left, sprite.top, cell.w * this.scale, cell.h * this.scale);
        */        
        
        /*
        var imgData = context.getImageData(sprite.left, sprite.top, cell.w * this.scale, cell.h * this.scale);
        for (var i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i] != 0) {
        imgData.data[i] = 0xff;
        imgData.data[i + 1] = 0xff;
        imgData.data[i + 2] = 0xff;
        }
        }
        context.putImageData(imgData, 0, 0, sprite.left, sprite.top, cell.w * this.scale, cell.h * this.scale);
        */
    }
}