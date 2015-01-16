///<reference path="../Game.ts"/>
///<reference path="sprite.ts"/>
///<reference path="bullet.ts"/>

class Electrode extends RobotronSprite {
    hit:boolean;
    rgbColors:  () => string;

    constructor(game: Game, left: number, top: number, rgbColors: () => string) {
        super('electrode', game, left, top);
        this.hit = false;
        this.width = 10 * 2;
        this.height = 18 * 2;
        this.enemy = true;
        this.rgbColors = rgbColors;
        this.canKill = true;
        game.addSprite(this);
    }

    painter(context: CanvasRenderingContext2D) {
        context.save();

        context.fillStyle = this.rgbColors();
        context.fillRect(this.left, this.top, this.width, this.height);

        context.restore();
    }

    kill(bullet: Bullet){
        this.game.playSound("sound_kill");
        this.hit = true;
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        if (this.hit) {
            this.width -= 1;
            this.height -= 1;

            if (this.height == 0 || this.width == 0) {
                this.game.removeSprite(this);
            }
        }
    }
}