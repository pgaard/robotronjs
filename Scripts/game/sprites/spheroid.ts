///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>
///<reference path="Enforcer.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="Bonus.ts"/>

class Spheroid extends AnimatedSprite {
    spawns: number = 0;
    startTime: number;
    constructor(game: Game, left: number, top: number) {
        super('spheroid', game, left, top, "all", Spheroid.cells);
        this.speed = 200;
        this.width = Spheroid.cells['all'][0].w * 2;
        this.height = Spheroid.cells['all'][0].h * 2;
        this.enemy = true;
        this.canKill = true;
        this.mustKill = true;
        this.score = 1000;
        this.setDirectionSpheroid();
        this.startTime = getTimeNow();
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        this.advanceFrame(time, 25);
        if (Math.random() < .005) this.setDirectionSpheroid();

        // after 5 sec spawn 4 enforcers at random interval
        if ((getTimeNow() - this.startTime > 5000) && Math.random() < 0.01) {
            new Enforcer(this.game, this.left, this.top);
            this.game.playSound("sound_enforcerbirth");
            this.spawns++;
            if (this.spawns == 3) {
                this.game.removeSprite(this);
            }
        }
        this.move(time, true);
    }

    // override
    setDirectionSpheroid() {
        var theta = 2 * Math.PI * Math.random();
        this.velocityX = Math.cos(theta) * this.speed;
        this.velocityY = Math.sin(theta) * this.speed;
    }

    // override - hug walls
    move(time: number, wallBounce: boolean){
        var deltaX = this.game.pixelsPerFrame(time, this.velocityX);
        var deltaY = this.game.pixelsPerFrame(time, this.velocityY);

        if(wallBounce) {
            if ((this.left + this.width + deltaX > this.game.right) ||
               (this.left + deltaX < this.game.left) ) {
                this.velocityX = 0;
                this.velocityY = (Math.random() < .5) ? this.speed : -this.speed;
                deltaX = 0;
            }
            else if (this.top + this.height + deltaY > this.game.bottom ||
                    (this.top + deltaY < this.game.top)) {
                this.velocityY = 0;
                this.velocityX = (Math.random() < .5) ? this.speed : -this.speed;
                deltaY = 0;
            }
        }

        this.left += deltaX;
        this.top += deltaY;
    }

    kill(bullet: Bullet){
        bullet.game.playSound("sound_spheroidkill");
        this.game.removeSprite(this);
        this.game.addSprite(new Bonus(this.game, this.left, this.top, "1000" ));
    }

    static cells : ISpriteCells = {
        all: [
            { x: 561-42*7, y: 81, w: 30, h: 30 },
            { x: 561-42*6, y: 81, w: 30, h: 30 },
            { x: 561-42*5, y: 81, w: 30, h: 30 },
            { x: 561-42*4, y: 81, w: 30, h: 30 },
            { x: 561-42*3, y: 81, w: 30, h: 30 },
            { x: 561-42*2, y: 81, w: 30, h: 30 },
            { x: 561-42, y: 81, w: 30, h: 30 },
            { x: 561, y: 81, w: 30, h: 30 },
            { x: 561-42, y: 81, w: 30, h: 30 },
            { x: 561-42*2, y: 81, w: 30, h: 30 },
            { x: 561-42*3, y: 81, w: 30, h: 30 },
            { x: 561-42*4, y: 81, w: 30, h: 30 },
            { x: 561-42*5, y: 81, w: 30, h: 30 },
            { x: 561-42*6, y: 81, w: 30, h: 30 },
        ]
    }
}