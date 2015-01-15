///<reference path="family.ts"/>

class Mikey extends Family {
    constructor(game: Game, left: number, top: number){
        super('mikey', game, left, top, Mikey.cells);
        this.width = 10 * 2;
        this.height = 20 * 2;
    }

    static cells: ISpriteCells = {
        left:[
            {x:271, y:39, w:10, h:20},
            {x:271+22, y:39, w:10, h:20},
            {x:271, y:39, w:10, h:20},
            {x:271+2*22, y:39, w:10, h:20}
        ],
        right:[
            {x:271+3*22, y:39, w:10, h:20},
            {x:271+4*22, y:39, w:10, h:20},
            {x:271+3*22, y:39, w:10, h:20},
            {x:271+5*22, y:39, w:10, h:20}
        ],
        down:[
            {x:271+6*22, y:39, w:10, h:20},
            {x:271+7*22, y:39, w:10, h:22},
            {x:271+6*22, y:39, w:10, h:20},
            {x:271+8*22, y:39, w:10, h:22}
        ],
        up:[
            {x:271+9*22, y:39, w:10, h:20},
            {x:271+10*22, y:39, w:10, h:22},
            {x:271+9*22, y:39, w:10, h:20},
            {x:271+11*22, y:39, w:10, h:22}
        ]
    }
}