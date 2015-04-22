///<reference path="family.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Mommy = (function (_super) {
    __extends(Mommy, _super);
    function Mommy(game, left, top) {
        _super.call(this, 'mommy', game, left, top, Mommy.cells);
        this.width = 14 * 2;
        this.height = 26 * 2;
    }
    Mommy.cells = {
        left: [
            { x: 205, y: 1, w: 12, h: 26 },
            { x: 231, y: 1, w: 12, h: 26 },
            { x: 205, y: 1, w: 12, h: 26 },
            { x: 257, y: 1, w: 14, h: 26 }
        ],
        right: [
            { x: 283, y: 1, w: 12, h: 26 },
            { x: 309, y: 1, w: 12, h: 26 },
            { x: 283, y: 1, w: 12, h: 26 },
            { x: 205 + 5 * 26, y: 1, w: 14, h: 26 }
        ],
        down: [
            { x: 205 + 6 * 26, y: 1, w: 14, h: 28 },
            { x: 205 + 7 * 26, y: 1, w: 14, h: 28 },
            { x: 205 + 6 * 26, y: 1, w: 14, h: 28 },
            { x: 205 + 8 * 26, y: 1, w: 14, h: 28 }
        ],
        up: [
            { x: 205 + 9 * 26, y: 1, w: 14, h: 28 },
            { x: 205 + 10 * 26, y: 1, w: 14, h: 28 },
            { x: 205 + 9 * 26, y: 1, w: 14, h: 28 },
            { x: 205 + 11 * 26, y: 1, w: 14, h: 28 }
        ]
    };
    return Mommy;
})(Family);
//# sourceMappingURL=mommy.js.map