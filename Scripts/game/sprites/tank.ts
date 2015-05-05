class Tank extends RobotronSprite
{    
    constructor(game: Game, left: number, top: number, private rgbColors: RgbFunction) {
        super('tank', game, left, top, "all", Tank.cells);
        this.speed = 50;
        this.width = Tank.cells['all'][0].w * 2;
        this.height = Tank.cells['all'][0].h * 2;
        this.enemy = true;
        this.mustKill = true;
        this.canKill = true;
        this.score = 200;
        this.setRandomDirection();
        this.queueRandomEvent(3, 0, true, () => this.setRandomDirection());
        this.queueRandomEvent(4, 1, true, () => this.shootAtPlayer());
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        this.advanceFrame(time, 200);
        this.fireRandomEvents();
        this.move(time);
    }

    // override
    setRandomDirection() {
        var theta = Quark.random45degreeAngle();
        this.velocityX = Math.cos(theta) * this.speed;
        this.velocityY = Math.sin(theta) * this.speed;
    }

    shootAtPlayer() {
        var man = RobotronSprite.getMan();
        var theta = Math.atan((this.top - man.top) / (this.left - man.left));
        var reverse = this.left > man.left ? -1 : 1;
        var shootX = Math.cos(theta) * reverse;
        var shootY = Math.sin(theta) *  reverse;
        var bullet = new TankShot(this.game, this.left, this.top, shootX, shootY, this.rgbColors);
        this.game.playSound("sound_enforcershot");
    }

    kill(bullet: Bullet) {
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        bullet.game.playSound("sound_kill");
        this.game.removeSprite(this);
    }

    private static cells: ISpriteCells = {
        all: [
            { x: 1, y: 275, w: 26, h: 32 },
            { x: 1 + 38, y: 275, w: 26, h: 32 },
            { x: 1 + 38*2, y: 275, w: 26, h: 32 },
            { x: 1 + 38*3, y: 275, w: 26, h: 32 }
            ]
    }
}