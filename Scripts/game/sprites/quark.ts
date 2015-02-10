class Quark extends RobotronSprite {
    spawns: number = 0;
    static tanksSpawned = 4;
    constructor(game: Game, left: number, top: number, private rgbColors: () => string) {
        super('quark', game, left, top, "all", Quark.cells);
        this.speed = 150;
        this.width = Quark.cells['all'][0].w * 2;
        this.height = Quark.cells['all'][0].h * 2;
        this.enemy = true;
        this.canKill = true;
        this.mustKill = true;
        this.score = 1000;
        this.setDirectionQuark();
        this.queueRandomEvent(2, 0, true, () => this.setDirectionQuark());
        this.queueRandomEvent(2, 4, true, () => this.spawnTank());
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        this.advanceFrame(time, 25);
        this.fireRandomEvents();
        this.move(time);
    }

    spawnTank() {
        new Tank(this.game, this.left, this.top, this.rgbColors );
        this.game.playSound("sound_enforcerbirth");
        this.spawns++;
        if (this.spawns == Quark.tanksSpawned) {
            this.game.removeSprite(this);
        }
    }

    static random45degreeAngle() {
        return 2 * Math.PI * ((Math.round(Math.random() * 4) / 4) + .125);
    }

    // override
    setDirectionQuark() {                
        var theta = Quark.random45degreeAngle();
        this.velocityX = Math.cos(theta) * this.speed;
        this.velocityY = Math.sin(theta) * this.speed;
    }

    kill(bullet: Bullet){
        bullet.game.playSound("sound_spheroidkill");
        this.game.removeSprite(this);
        this.game.addSprite(new Bonus(this.game, this.left, this.top, "1000" ));
    }

    private static cells : ISpriteCells = {
        all: [
            { x: 241 + 42 * 0, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 1, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 2, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 3, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 4, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 5, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 6, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 7, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 8, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 7, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 6, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 5, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 4, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 3, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 2, y: 235, w: 30, h: 30 },
            { x: 241 + 42 * 1, y: 235, w: 30, h: 30 }
        ]
    }
}
