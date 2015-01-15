///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>
///<reference path="Explosion.ts"/>
///<reference path="EnforcerBullet.ts"/>

class Enforcer extends AnimatedSprite
{
    static getMan: () => Sprite;

    constructor(game: Game, left: number, top: number) {
        super('enforcer', game, left, top, 'all', Enforcer.cells);
        this.width = 18 * 2;
        this.height = 22 * 2;
        this.enemy = true;
        this.canKill = true;
        this.mustKill = true;
        this.score = 150;
        this.speed = 200;
        this.setRandomDirectionEnforcer();
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        this.advanceFrame(time, 200, true); // just grows and stops animating
        if (Math.random() < .01)
            this.setRandomDirectionEnforcer();
        this.move(time, true);

        if (Math.random() < .005) {
            // shoot
            var man = Enforcer.getMan();
            var distance = this.game.distance(this.left, this.top, man.left, man.top);
            var bulletSpeed = (distance / this.game.width()) * 600;
            var theta = Math.atan((this.top - man.top) / (this.left - man.left));
            var reverse = this.left > man.left ? -1 : 1;
            var velocityX = Math.cos(theta) * bulletSpeed * reverse;
            var velocityY = Math.sin(theta) * bulletSpeed * reverse;
            var bullet = new EnforcerBullet(this.game, this.left, this.top, velocityX, velocityY);
            bullet.speed = bulletSpeed;
            this.game.playSound("sound_enforcershot");
        }
    }

    // override
    setRandomDirectionEnforcer() {
        this.speed = (Math.random() * 150) + 25;
        var theta = 2 * Math.PI * Math.random();
        this.velocityX = Math.cos(theta) * this.speed;
        this.velocityY = Math.sin(theta) * this.speed;
    }

    kill(bullet: Bullet){
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        bullet.game.playSound("sound_kill");
        this.game.removeSprite(this);
    }

    static cells : ISpriteCells = {
        all: [
            { x: 1 + 30*1, y: 123, w: 18, h: 22 },
            { x: 1 + 30*2, y: 123, w: 18, h: 22 },
            { x: 1 + 30*3, y: 123, w: 18, h: 22 },
            { x: 1 + 30*4, y: 123, w: 18, h: 22 },
            { x: 1 + 30*5, y: 123, w: 18, h: 22 },
            { x: 1, y: 123, w: 18, h: 22 }
        ]
    }
}