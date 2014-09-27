// Wave	Grunts	Electrodes	Mommies	Daddies	Mikeys	Hulks	Brains	Spheroids	Quarks
var Waves = {
    waves: [
        [1, 15, 5,  1, 1, 0, 0, 0, 0, 0],
        [2, 17, 15, 1, 1, 1, 5, 0, 1, 0],
        [3, 22, 25, 2, 2, 2, 6, 0, 3, 0],
        [4, 34, 25, 2, 2, 2, 7, 0, 4, 0],
        [5, 20, 20, 15, 0, 1, 0, 15, 1, 0],  
        [6,	32,	25,	3,	3,	3,	7,	0,	4,	0]
//7	0	0	4	4	4	12	0	0	10
//8	35	25	3	3	3	8	0	5	0
//9	60	0	3	3	3	4	0	5	0
//10	25	20	0	22	0	0	20	1	0
//11	35	25	3	3	3	8	0	5	0
//12	0	0	3	3	3	13	0	0	12
//13	35	25	3	3	3	8	0	5	0
//14	27	5	5	5	5	20	0	2	0
//15	25	20	0	0	22	2	20	1	0
//16	35	25	3	3	3	3	0	5	0
//17	0	0	3	3	3	14	0	0	12
//18	35	25	3	3	3	8	0	5	0
//19	70	0	3	3	3	3	0	5	0
//20	25	20	8	8	8	2	20	2	0
//21	35	25	3	3	3	8	0	5	0
//22	0	0	3	3	3	15	0	0	12
//23	35	25	3	3	3	8	0	5	0
//24	0	0	3	3	3	13	0	6	7
//25	25	20	25	0	1	1	21	1	0
//26	35	25	3	3	3	8	0	5	0
//27	0	0	3	3	3	16	0	0	12
//28	35	25	3	3	3	8	0	5	1
//29	75	0	3	3	3	4	0	5	1
//30	25	20	0	25	0	1	22	1	1
//31	35	25	3	3	3	8	0	5	1
//32	0	0	3	3	3	16	0	0	13
//33	35	25	3	3	3	8	0	5	1
//34	30	0	3	3	3	25	0	2	2
//35	27	15	0	0	25	2	23	1	2
//36	35	25	3	3	3	8	0	5	2
//37	0	0	3	3	3	16	0	0	14
//38	35	25	3	3	3	8	0	5	2
//39	80	0	3	3	3	6	0	5	1
//40	30	15	10	10	10	2	25	1	1
  
    ],
    waveItems: {
        wave: 0,
        grunts: 1,
        electrodes: 2,
        mommies: 3,
        daddies: 4,
        mikeys: 5,
        hulks: 6,
        brains: 7,
        spheroids: 8,
        quarks: 9
    },
    getRoboCount: function (waveNum, name) {
        var w = this.waves[waveNum];
        return w[this.waveItems[name]];
    }
};


//Grunt	100 points
//Brain	500 points
//Cruise Missile	25 points
//Prog	100 points
//Sphereoid	1000 points
//Enforcer	150 points
//Enforcer Spark	25 points
//Quark	1000 points
//Tank	200 points
//Tank Shell	50 points
//1st family member	1000 points
//2nd family member	2000 points
//3rd family member	3000 points
//4th family member	4000 points
//5th+ family member	5000 points
//(Point values for family members reset at the start of a new wave and after a life is lost.)



