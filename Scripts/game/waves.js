// Wave	Grunts	Electrodes	Mommies	Daddies	Mikeys	Hulks	Brains	Spheroids	Quarks   Border
var Waves = (function () {
    function Waves() {
    }
    Waves.getRoboCount = function (waveNum, name) {
        var w = this.waves[waveNum];
        return w[this.waveItems[name]];
    };
    Waves.getBorderColor = function (waveNum) {
        var w = this.waves[waveNum];
        return w[this.waveItems['borderColor']];
    };
    Waves.waves = [
        [1, 15, 5, 1, 1, 0, 0, 0, 0, 0, 'orange'],
        [2, 17, 15, 1, 1, 1, 5, 0, 1, 0, 'yellow'],
        [3, 22, 25, 2, 2, 2, 6, 0, 3, 0, 'red'],
        [4, 34, 25, 2, 2, 2, 7, 0, 4, 0, 'purple'],
        [5, 20, 20, 15, 0, 1, 0, 15, 1, 0, 'blue'],
        [6, 32, 25, 3, 3, 3, 7, 0, 4, 0],
        [7, 0, 0, 4, 4, 4, 12, 0, 0, 10],
        [8, 35, 25, 3, 3, 3, 8, 0, 5, 0],
        [9, 60, 0, 3, 3, 3, 4, 0, 5, 0],
        [10, 25, 20, 0, 22, 0, 0, 20, 1, 0],
        [11, 35, 25, 3, 3, 3, 8, 0, 5, 0]
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
//# sourceMappingURL=Waves.js.map