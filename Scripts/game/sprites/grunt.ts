///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="Explosion.ts"/>

class Grunt extends AnimatedSprite {
    waveDuration: WaveDurationFunction;
    manPosition: ManPositionFunction;

    constructor(game: Game, left: number, top: number, waveDuration: WaveDurationFunction, manPosition: ManPositionFunction) {
        super('grunt', game, left, top,'all', Grunt.cells);
        this.width = 14 * 2;
        this.height = 22 * 2;
        this.enemy = true;
        this.canKill = true;
        this.mustKill = true;
        this.score = 100;
        this.waveDuration = waveDuration;
        this.manPosition = manPosition;
    }

    mover(context: CanvasRenderingContext2D, time: number) {

        // speed up during wave
        var speed = 50 + (this.waveDuration() ? (this.waveDuration() * 0.004) : 1);

        this.advanceFrame(time, 75);

        // move straight towards man
        var man = this.manPosition();
        var theta = Math.atan((this.top - man.top) / (this.left - man.left));
        var reverse = this.left > man.left ? -1 : 1;
        this.velocityX = Math.cos(theta) * speed * reverse;
        this.velocityY = Math.sin(theta) * speed * reverse;

        this.move(time, false);
    }

    kill(bullet : Bullet){
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        bullet.game.playSound("sound_kill");
        this.game.removeSprite(this);
    }

    static cells : ISpriteCells = {
        all: [
            { x: 150, y: 234, w: 19, h: 27 },
            { x: 180, y: 234, w: 19, h: 27 },
            { x: 210, y: 234, w: 19, h: 27 }
        ]
    }
}
