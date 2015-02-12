class TankShot extends RobotronSprite {
    velocityX: number;
    velocityY: number;
    dissapearing = false;
    static bulletSpeed = 500;
    static radius = 10;

    constructor(game: Game, left: number, top: number, shootX: number, shootY: number, rgbColors: () => string) {
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
        context.arc(this.left + TankShot.radius, this.top + TankShot.radius, TankShot.radius, 0, Math.PI * 2, false);
        context.fillStyle = RobotronSprite.rgbColors();
        context.lineWidth = 2;
        context.strokeStyle = 'white';
        context.fill();
        context.stroke();

        context.beginPath();
        context.arc(this.left + TankShot.radius, this.top + TankShot.radius, TankShot.radius - 2, 0, Math.PI * 2, false);
        context.strokeStyle = 'black';
        context.stroke();

        context.restore();
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        this.move(time);
        this.fireRandomEvents();    
    }

    checkDissapear() {
        if (!this.dissapearing) {
            this.dissapearing = true;
            this.queueRandomEvent(2, .5, false, () => {
                this.game.removeSprite(this)
            });
        }
    }

    adjustMoveDelta(deltaX: number, deltaY: number) {

        if (this.left + deltaX + this.width > this.game.right) {
            this.velocityX = -Math.abs(this.velocityX);
            deltaX = -Math.abs(deltaX);
            this.checkDissapear();
        }
        else if (this.left + deltaX < this.game.left) {
            this.velocityX = Math.abs(this.velocityX);
            deltaX = Math.abs(deltaX);
            this.checkDissapear();
        }
        else if (this.top + deltaY + this.height > this.game.bottom) {
            this.velocityY = -Math.abs(this.velocityY);
            deltaY = -Math.abs(deltaY);
            this.checkDissapear();
        }
        else if (this.top + deltaY < this.game.top) {
            this.velocityY = Math.abs(this.velocityY);
            deltaY = Math.abs(deltaY);
            this.checkDissapear();
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