 class TankShot extends RobotronSprite {
    velocityX: number;
    velocityY: number;
    static bulletSpeed = 400;
    static radius = 10;

    constructor(game: Game, left: number, top: number, shootX: number, shootY: number, rgbColors: () => string ) {
        super('tankshot', game, left, top);
        this.velocityX = shootX * TankShot.bulletSpeed;
        this.velocityY = shootY * TankShot.bulletSpeed;
        this.canKill = true;    
        this.enemy = true;
        this.width = this.height = TankShot.radius * 2;
    }

    painter(context: CanvasRenderingContext2D) {
        context.save();
        context.beginPath();
        context.arc(this.left + TankShot.radius, this.top - TankShot.radius, TankShot.radius, 0, Math.PI * 2, false);
        context.fillStyle = RobotronSprite.rgbColors();
        context.lineWidth = 2;
        context.strokeStyle = 'white';
        context.fill();
        context.stroke();
        context.restore();
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        this.move(time);
    }

    adjustMoveDelta(deltaX: number, deltaY: number) {
        if (this.left + deltaX > this.game.right ||
            this.left + deltaX < this.game.left ||
            this.top + deltaY > this.game.bottom ||
            this.top + deltaY < this.game.top) {
            this.game.removeSprite(this);
        }
        return { deltaX: deltaX, deltaY: deltaY };
    }  

     kill(bullet: Bullet) {
         var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
         var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
         //TODO: sound
        this.game.removeSprite(this);
    }
}