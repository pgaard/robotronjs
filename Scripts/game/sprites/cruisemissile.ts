class CruiseMissile extends RobotronSprite
{
    static distanceHorizontal = 40;
    static distanceVertical = 20;
    static velocityHorizontal = 200;
    static velocityVertical = 100;
    manPosition: ManPositionFunction;
    front: Point;
    middle: Point;
    end: Point;
    percentage: number;
    velocityEndX: number;
    velocityEndY: number;

    constructor(game: Game, left: number, top: number, manPosition: ManPositionFunction) {
        super('cruisemissile', game, left, top);
        this.manPosition = manPosition;
        this.canKill = true;
        this.enemy = true;
        this.width = 5;
        this.height = 5;

        this.front = { x: left, y: top };
        this.middle = { x: left, y: top };
        this.setRandomVelocity(this.front);
    }    

    move(time: number) {
        if (Math.abs(this.front.x - this.middle.x) > CruiseMissile.distanceHorizontal ||
            Math.abs(this.front.y - this.middle.y) > CruiseMissile.distanceVertical) {
            this.advanceMissle();
        }

        var deltaX = this.game.pixelsPerFrame(time, this.velocityX);
        var deltaY = this.game.pixelsPerFrame(time, this.velocityY);

        this.front.x += deltaX;
        this.front.y += deltaY;

        this.top = this.front.y;
        this.left = this.front.x;

        if (this.end) {
            var deltaX = this.game.pixelsPerFrame(time, this.velocityEndX);
            var deltaY = this.game.pixelsPerFrame(time, this.velocityEndY);

            this.end.x += deltaX;
            this.end.y += deltaY;
        }
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        this.move(time);
    }

    painter(context: CanvasRenderingContext2D) {
        context.save();
        context.beginPath();
        context.strokeStyle = 'white';

        context.lineWidth = this.width;
        context.moveTo(this.front.x, this.front.y);
        context.lineTo(this.middle.x, this.middle.y);
        if (this.end)
            context.lineTo(this.end.x, this.end.y);

        context.stroke();
        context.restore();
    }

    setRandomVelocity(start: Point) {
        var man = this.manPosition();
        var random = Math.random();
        var vertical = random > .3;
        var horizontal = random < .7;

        if (vertical) {
            if (start.y <= man.top)
                this.velocityY = CruiseMissile.velocityVertical;
            else
                this.velocityY = -CruiseMissile.velocityVertical;
        } else {
            this.velocityY = 0;
        }

        if (horizontal) {
            if (start.x <= man.left)
                this.velocityX = CruiseMissile.velocityHorizontal;
            else
                this.velocityX = -CruiseMissile.velocityHorizontal;
        } else {
            this.velocityX = 0;
        }
    }

    advanceMissle() {

        this.end = { x: this.middle.x, y: this.middle.y };

        this.middle.x = this.front.x;
        this.middle.y = this.front.y;

        this.velocityEndX = this.velocityX;
        this.velocityEndY = this.velocityY;

        this.setRandomVelocity(this.front);
    }

    kill(bullet: Bullet) {
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(bullet.game, this.left, this.top, this.width, this.height, horizontal);
        this.game.removeSprite(this);
    }
}   