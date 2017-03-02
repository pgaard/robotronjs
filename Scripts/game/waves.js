// Wave	Grunts	Electrodes	Mommies	Daddies	Mikeys	Hulks	Brains	Spheroids	Quarks   
var Waves = (function () {
    function Waves() {
    }
    Waves.getRoboCount = function (waveNum, name) {
        var w = this.waves[waveNum];
        return w[this.waveItems[name]];
    };
    Waves.getBorderColor = function (waveNum) {
        return this.borderColors[waveNum % 10];
    };
    Waves.waves = [
        [1, 15, 5, 1, 1, 0, 0, 0, 0, 0],
        [2, 17, 15, 1, 1, 1, 5, 0, 1, 0],
        [3, 22, 25, 2, 2, 2, 6, 0, 3, 0],
        [4, 34, 25, 2, 2, 2, 7, 0, 4, 0],
        [5, 20, 20, 15, 0, 1, 0, 15, 1, 0],
        [6, 32, 25, 3, 3, 3, 7, 0, 4, 0],
        [7, 0, 0, 4, 4, 4, 12, 0, 0, 10],
        [8, 35, 25, 3, 3, 3, 8, 0, 5, 0],
        [9, 60, 0, 3, 3, 3, 4, 0, 5, 0],
        [10, 25, 20, 0, 22, 0, 0, 20, 1, 0],
        [11, 35, 25, 3, 3, 3, 8, 0, 5, 0]
    ];
    Waves.borderColors = [
        'orange',
        'yellow',
        'red',
        'purple',
        'blue',
        'purple',
        'orange',
        'grey',
        'black',
        'rotate'
    ];
    Waves.waveItems = {
        wave: 0,
        grunts: 1,
        electrodes: 2,
        mommies: 3,
        daddies: 4,
        mikeys: 5,
        hulks: 6,
        brains: 7,
        spheroids: 8,
        quarks: 9,
        borderColor: 10
    };
    return Waves;
})();
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
//# sourceMappingURL=waves.js.map