////<reference path="animation.ts" />
var getTimeNow = function () {
    return Date.now();
};
var Game = (function () {
    function Game(gameName, canvasId) {
        var canvas = document.getElementById(canvasId), self = this;
        this.context = canvas.getContext('2d');
        this.gameName = gameName;
        this.sprites = [];
        this.keyListeners = [];
        // Image loading
        //this.imageLoadingProgressCallback;
        this.images = {};
        this.imageUrls = [];
        this.imagesLoaded = 0;
        this.imagesFailedToLoad = 0;
        this.imagesIndex = 0;
        this.score = 0;
        this.fps = 0;
        this.STARTING_FPS = 60;
        this.paused = false;
        this.PAUSE_TIMEOUT = 100;
        this.soundOn = true;
        this.soundChannels = [];
        this.audio = new Audio();
        this.NUM_SOUND_CHANNELS = 10;
        this.HIGH_SCORES_SUFFIX = "highscores";
        this.pressedKeys = {};
        for (var i = 0; i < this.NUM_SOUND_CHANNELS; ++i) {
            var audio = new Audio();
            this.soundChannels.push(audio);
        }
        // The this object in the following event handlers is the
        // DOM window, which is why the functions call
        // self.keyPressed() instead of this.keyPressed(e).
        window.onkeypress = function (e) {
            self.keyPressed(e);
        };
        window.onkeydown = function (e) {
            self.keyPressed(e);
        };
        window.onkeyup = function (e) {
            self.keyReleased(e);
        };
    }
    // Game loop.......................................................
    Game.prototype.start = function () {
        var self = this;
        // The this variable is the game
        this.startTime = getTimeNow(); // Record game's startTime
        // Starts the animation
        requestNextAnimationFrame(function (time) {
            // The this variable in this function is the window.
            self.animate.call(self, time); // self is the game
        });
    };
    Game.prototype.getImage = function (imageUrl) {
        return this.images[imageUrl];
    };
    Game.prototype.imageLoadedCallback = function (e) {
        this.imagesLoaded++;
    };
    // This method is called by loadImage() when
    // an image does not load successfully.
    Game.prototype.imageLoadErrorCallback = function (e) {
        this.imagesFailedToLoad++;
    };
    // Loads a particular image
    Game.prototype.loadImage = function (imageUrl) {
        var image = new Image(), self = this;
        image.src = imageUrl;
        image.addEventListener('load', function (e) {
            self.imageLoadedCallback(e);
        });
        image.addEventListener('error', function (e) {
            self.imageLoadErrorCallback(e);
        });
        this.images[imageUrl] = image;
    };
    // You call this method repeatedly to load images that have been
    // queued (by calling queueImage()). This method returns the
    // percent of the game's images that have been processed. When
    // the method returns 100, all images are loaded, and you can
    // quit calling this method.
    Game.prototype.loadImages = function () {
        // If there are images left to load
        if (this.imagesIndex < this.imageUrls.length) {
            this.loadImage(this.imageUrls[this.imagesIndex]);
            this.imagesIndex++;
        }
        // Return the percent complete
        return (this.imagesLoaded + this.imagesFailedToLoad) / this.imageUrls.length * 100;
    };
    // Call this method to add an image to the queue. The image
    // will be loaded by loadImages().
    Game.prototype.queueImage = function (imageUrl) {
        this.imageUrls.push(imageUrl);
    };
    // Drives the game's animation. This method is called by the
    // browser when it's time for the next animation frame.
    Game.prototype.animate = function (time) {
        var self = this;
        if (this.paused) {
            // In PAUSE_TIMEOUT (100) ms, call this method again to see
            // if the game is still paused. There's no need to check
            // more frequently.
            setTimeout(function () {
                self.animate.call(self, time);
            }, this.PAUSE_TIMEOUT);
        }
        else {
            // Game is not paused
            this.tick(time); // Update fps, game time
            this.clearScreen(); // Prepare for next frame
            this.startAnimate(time); // Override as you wish
            this.paintUnderSprites(); // Override as you wish
            this.updateSprites(time); // Invoke sprite behaviors
            this.paintSprites(time); // Paint sprites in the canvas
            this.paintOverSprites(); // Override as you wish
            this.endAnimate(); // Override as you wish
            // Call this method again when it's time for
            // the next animation frame
            requestNextAnimationFrame(function (time) {
                self.animate.call(self, time);
            });
        }
    };
    Game.prototype.togglePaused = function () {
        var now = getTimeNow();
        this.paused = !this.paused;
        if (this.paused) {
            this.startedPauseAt = now;
        }
        else {
            // Adjust start time, so game starts where it left off when
            // the user paused it.
            this.startTime = this.startTime + now - this.startedPauseAt;
            this.lastTime = now;
        }
    };
    // Update the frame rate, game time, and the last time the
    // application drew an animation frame.
    Game.prototype.tick = function (time) {
        this.updateFrameRate(time);
        this.gameTime = (getTimeNow()) - this.startTime;
        this.lastTime = time;
    };
    // Update the frame rate, based on the amount of time it took    
    // for the last animation frame only.
    Game.prototype.updateFrameRate = function (time) {
        if (this.lastTime === 0)
            this.fps = this.STARTING_FPS;
        else
            this.fps = 1000 / (time - this.lastTime);
    };
    // Clear the entire canvas.
    Game.prototype.clearScreen = function () {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    };
    // Update all sprites. The sprite update() method invokes all
    // of a sprite's behaviors.
    Game.prototype.updateSprites = function (time) {
        for (var i = 0; i < this.sprites.length; ++i) {
            var sprite = this.sprites[i];
            sprite.update(this.context, time);
        }
        ;
    };
    // Paint all visible sprites.
    Game.prototype.paintSprites = function (time) {
        for (var i = 0; i < this.sprites.length; ++i) {
            var sprite = this.sprites[i];
            if (sprite.visible)
                sprite.paint(this.context);
        }
    };
    // Given a velocity of some object, calculate the number of pixels
    // to move that object for the current frame.
    Game.prototype.pixelsPerFrame = function (time, velocity) {
        // (pixels/second) * (second/frame) = pixels/frame:
        return velocity / this.fps; // pixels/frame
    };
    // High scores.....................................................
    // Returns an array of high scores from local storage.
    Game.prototype.getHighScores = function () {
        var key = this.gameName + this.HIGH_SCORES_SUFFIX, highScoresString = localStorage[key];
        if (highScoresString == undefined) {
            localStorage[key] = JSON.stringify([]);
        }
        return JSON.parse(localStorage[key]);
    };
    // Sets the high score in local storage.
    Game.prototype.setHighScore = function (highScore) {
        var key = this.gameName + this.HIGH_SCORES_SUFFIX, highScores = localStorage[key];
        highScores.unshift(highScore);
        localStorage[key] = JSON.stringify(highScores);
    };
    Game.prototype.clearHighScores = function () {
        localStorage[this.gameName + this.HIGH_SCORES_SUFFIX] = JSON.stringify([]);
    };
    // Key listeners...................................................
    // Add a (key, listener) pair to the keyListeners array.
    Game.prototype.addKeyListener = function (keyAndListener) {
        this.keyListeners.push(keyAndListener);
    };
    // Given a key, return the associated listener.
    Game.prototype.findKeyListener = function (key) {
        var listener;
        for (var i = 0; i < this.keyListeners.length; ++i) {
            var keyAndListener = this.keyListeners[i], currentKey = keyAndListener.key;
            if (currentKey === key) {
                listener = keyAndListener.listener;
            }
        }
        ;
        return listener;
    };
    Game.prototype.keyCodeToName = function (keyCode) {
        var key;
        if (keyCode >= 65 && keyCode <= 90) {
            return String.fromCharCode(keyCode).toLowerCase();
        }
        switch (keyCode) {
            case 32:
                key = 'space';
                break;
            case 37:
                key = 'left arrow';
                break;
            case 39:
                key = 'right arrow';
                break;
            case 38:
                key = 'up arrow';
                break;
            case 40:
                key = 'down arrow';
                break;
        }
        return key;
    };
    // This method is the callback for key down and key press events.
    Game.prototype.keyPressed = function (e) {
        var listener, key = this.keyCodeToName(e.keyCode);
        this.pressedKeys[key] = true;
        listener = this.findKeyListener(key);
        if (listener) {
            listener(true); // Invoke the listener function            
        }
    };
    // This method is the callback for key up events.
    Game.prototype.keyReleased = function (e) {
        var listener, key = this.keyCodeToName(e.keyCode);
        this.pressedKeys[key] = false;
        listener = this.findKeyListener(key);
        if (listener) {
            listener(false); // Invoke the listener function
        }
    };
    // Sound...........................................................    
    Game.prototype.canPlayOggVorbis = function () {
        return "" != this.audio.canPlayType('audio/ogg; codecs="vorbis"');
    };
    Game.prototype.canPlayMp3 = function () {
        return "" != this.audio.canPlayType('audio/mpeg');
    };
    // Returns the first sound available channel.
    Game.prototype.getAvailableSoundChannel = function () {
        var audio;
        for (var i = 0; i < this.NUM_SOUND_CHANNELS; ++i) {
            audio = this.soundChannels[i];
            if (audio.played && audio.played.length > 0) {
                if (audio.ended)
                    return audio;
            }
            else {
                if (!audio.ended)
                    return audio;
            }
        }
        return undefined; // All channels in use
    };
    // Given an identifier, play the associated sound.
    Game.prototype.playSound = function (id) {
        return;
        var channel = this.getAvailableSoundChannel(), element = document.getElementById(id);
        if (channel && element) {
            channel.src = element.src === '' ? element.currentSrc : element.src;
            channel.load();
            channel.play();
        }
    };
    // Sprites.........................................................
    // Add a sprite to the game. The game engine will update the sprite
    // and paint it (if it's visible) in the animate() method.
    Game.prototype.addSprite = function (sprite) {
        this.sprites.push(sprite);
    };
    // It's probably a good idea not to access sprites directly,
    // because it's better to write generalized code that deals with
    // all sprites, so this method should be used sparingly.
    Game.prototype.getSprite = function (name) {
        for (var i in this.sprites) {
            if (this.sprites[i].name === name)
                return this.sprites[i];
        }
        return null;
    };
    Game.prototype.getAllSprites = function (nameOrFunc) {
        var list = [];
        if (typeof (nameOrFunc) == "function") {
            for (var i in this.sprites) {
                if (nameOrFunc(this.sprites[i]))
                    list.push(this.sprites[i]);
            }
        }
        else {
            for (var i in this.sprites) {
                if (!nameOrFunc || this.sprites[i].name === nameOrFunc)
                    list.push(this.sprites[i]);
            }
        }
        return list;
    };
    Game.prototype.getSpriteCount = function (type) {
        var count = 0;
        for (var i in this.sprites) {
            if (this.sprites[i].name == type)
                count++;
        }
        return count;
    };
    Game.prototype.removeSprite = function (sprite) {
        for (var i in this.sprites) {
            if (this.sprites[i] == sprite) {
                this.sprites.splice(i, 1);
                return;
            }
        }
    };
    Game.prototype.removeAllSprites = function () {
        this.sprites = [];
    };
    // Override the following methods as desired. animate() calls
    // the methods in the order they are listed.
    Game.prototype.startAnimate = function (time) {
    };
    Game.prototype.paintUnderSprites = function () {
    };
    Game.prototype.paintOverSprites = function () {
    };
    Game.prototype.endAnimate = function () {
    };
    Game.prototype.middle = function () {
        return {
            x: this.width() / 2,
            y: this.height() / 2
        };
    };
    Game.prototype.width = function () {
        return this.context.canvas.width;
    };
    Game.prototype.height = function () {
        return this.context.canvas.height;
    };
    Game.prototype.distance = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };
    return Game;
})();
//# sourceMappingURL=game.js.map