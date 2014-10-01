var Mommy = Family.extend({
    init:function(game, left, top){
        this._super('mommy', game, left, top);
    },
    width: 14 * 2,
    height: 26 * 2,
    cells: {
        left:[
            {x:205, y:1, w:12, h:26},
            {x:231, y:1, w:12, h:26},
            {x:257, y:1, w:14, h:26}
        ],
        right:[
            {x:283, y:1, w:12, h:26},
            {x:309, y:1, w:12, h:26},
            {x:205+5*26, y:1, w:14, h:26}
        ],
        down:[
            {x:205+6*26, y:1, w:14, h:28},
            {x:205+7*26, y:1, w:14, h:28},
            {x:205+8*26, y:1, w:14, h:28}
        ],
        up:[
            {x:205+9*26, y:1, w:14, h:28},
            {x:205+10*26, y:1, w:14, h:28},
            {x:205+11*26, y:1, w:14, h:28}
        ]
    }
});