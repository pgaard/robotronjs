var Daddy = Family.extend({
    init:function(game, left, top){
        this._super('daddy', game, left, top);
    },
    width: 14 * 2,
    height: 26 * 2,
    cells: {
        left:[
            {x:517, y:1, w:12, h:24},
            {x:549, y:1, w:14, h:26},
            {x:517, y:1, w:12, h:24},
            {x:577, y:1, w:14, h:24},
        ],
        right:[
            {x:1, y:39, w:14, h:24},
            {x:31, y:39, w:16, h:24},
            {x:1, y:39, w:14, h:24},
            {x:61, y:39, w:16, h:26}
        ],
        down:[
            {x:91, y:39, w:16, h:24},
            {x:121, y:39, w:16, h:26},
            {x:91, y:39, w:16, h:24},
            {x:151, y:39, w:16, h:26}
        ],
        up:[
            {x:183, y:39, w:16, h:24},
            {x:183+1*30, y:39, w:16, h:26},
            {x:183, y:39, w:16, h:24},
            {x:183+2*30, y:39, w:16, h:26}
        ]
    }
});