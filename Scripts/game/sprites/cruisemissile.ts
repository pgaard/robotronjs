class CruiseMissile extends Sprite
{
    manPosition: ManPositionFunction;
    point1: { x: number; y: number }
    point2: { x: number; y: number }
    point3: { x: number; y: number }
    vertical: boolean;

    constructor(game: Game, left: number, top: number, manPosition: ManPositionFunction) {
        super('cruisemissile', game, left, top);
        this.manPosition = manPosition;
        this.canKill = true;       
    }    

    mover(context: CanvasRenderingContext2D, time: number) {
        var man = this.manPosition();


        //var deltaX = this.game.pixelsPerFrame(time, this.velocityX);
        //var deltaY = this.game.pixelsPerFrame(time, this.velocityY);

    }

    painter(context: CanvasRenderingContext2D) {
        context.save();
        context.beginPath();
        context.strokeStyle = 'white';

        context.lineWidth = 5;
        context.moveTo(this.point1.x, this.point1.y);
        context.lineTo(this.point2.x, this.point2.y);
        if (this.point3)
            context.lineTo(this.point3.x, this.point3.y);

        context.stroke();
        context.restore();
    }
}