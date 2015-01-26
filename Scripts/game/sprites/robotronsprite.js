var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RobotronSprite = (function (_super) {
    __extends(RobotronSprite, _super);
    function RobotronSprite(name, game, left, top, startDirection, cells) {
        _super.call(this, name, game, left, top, startDirection, cells);
        this.canKill = false;
        this.mustKill = false;
        this.score = 0;
        this.startTime = getTimeNow();
        this.queuedEvents = [];
    }
    RobotronSprite.prototype.setRandomDirection = function () {
        var rand = Math.random() * 4;
        this.velocityX = this.velocityY = 0;
        if (rand < 1) {
            if (this.direction != 'all')
                this.direction = 'left';
            this.velocityX = -this.speed;
        }
        else if (rand < 2) {
            if (this.direction != 'all')
                this.direction = 'right';
            this.velocityX = this.speed;
        }
        else if (rand < 3) {
            if (this.direction != 'all')
                this.direction = 'up';
            this.velocityY = -this.speed;
        }
        else {
            if (this.direction != 'all')
                this.direction = 'down';
            this.velocityY = this.speed;
        }
    };
    // default movement - bounce off of walls
    RobotronSprite.prototype.adjustMoveDelta = function (deltaX, deltaY) {
        if (this.left + this.width + deltaX > this.game.right) {
            if (this.direction != 'all')
                this.direction = 'left';
            this.velocityX = -this.speed;
            deltaX = 0;
        }
        else if (this.left + deltaX < this.game.left) {
            if (this.direction != 'all')
                this.direction = 'right';
            this.velocityX = this.speed;
            deltaX = 0;
        }
        if (this.top + this.height + deltaY > this.game.bottom) {
            if (this.direction != 'all')
                this.direction = 'up';
            this.velocityY = -this.speed;
            deltaY = 0;
        }
        else if (this.top + deltaY < this.game.top) {
            if (this.direction != 'all')
                this.direction = 'down';
            this.velocityY = this.speed;
            deltaY = 0;
        }
        return { deltaX: deltaX, deltaY: deltaY };
    };
    RobotronSprite.prototype.kill = function (bullet) {
    };
    RobotronSprite.prototype.queueRandomEvent = function (averageSec, delaySec, repeat, event) {
        this.queuedEvents.push({
            averageSec: averageSec,
            repeat: repeat,
            time: RobotronSprite.currentTime + (delaySec * 1000) + Math.random() * (averageSec * 1000 * 2),
            event: event
        });
    };
    RobotronSprite.prototype.fireRandomEvents = function () {
        var i = this.queuedEvents.length;
        while (i--) {
            if (RobotronSprite.currentTime > this.queuedEvents[i].time) {
                this.queuedEvents[i].event();
                if (this.queuedEvents[i].repeat)
                    this.queuedEvents[i].time = RobotronSprite.currentTime + Math.random() * (this.queuedEvents[i].averageSec * 1000 * 2);
                else
                    this.queuedEvents.splice(i, 1);
            }
        }
    };
    return RobotronSprite;
})(AnimatedSprite);
//# sourceMappingURL=robotronSprite.js.map