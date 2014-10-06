var getTimeNow = function () {
    return new Date();
};

var Game = function (gameName, canvasId) {
    var canvas = document.getElementById(canvasId),
        self = this;

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

    this.startTime = 0;
    this.lastTime = 0;
    this.gameTime = 0;
    this.fps = 0;
    this.STARTING_FPS = 60;

    this.paused = false;
    this.startedPauseAt = 0;
    this.PAUSE_TIMEOUT = 100;

    this.soundOn = true;
    this.soundChannels = [];
    this.audio = new Audio();
    this.NUM_SOUND_CHANNELS = 10;

    this.pressedKeys = [];

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
};

Game.prototype = {
    // Game loop.......................................................
    start: function () {
        var self = this;
        // The this variable is the game
        this.startTime = getTimeNow(); // Record game's startTime
        // Starts the animation
        window.requestNextAnimationFrame(
            function (time) {
                // The this variable in this function is the window.
                self.animate.call(self, time); // self is the game
            });
    },

    getImage: function (imageUrl) {
        return this.images[imageUrl];
    },

    imageLoadedCallback: function (e) {
        this.imagesLoaded++;
    },

    // This method is called by loadImage() when
    // an image does not load successfully.
    imageLoadErrorCallback: function (e) {
        this.imagesFailedToLoad++;
    },

    // Loads a particular image
    loadImage: function (imageUrl) {
        var image = new Image(),
            self = this;
        image.src = imageUrl;
        image.addEventListener('load',
            function (e) {
                self.imageLoadedCallback(e);
            });
        image.addEventListener('error',
            function (e) {
                self.imageLoadErrorCallback(e);
            });
        this.images[imageUrl] = image;
    },

    // You call this method repeatedly to load images that have been
    // queued (by calling queueImage()). This method returns the
    // percent of the game's images that have been processed. When
    // the method returns 100, all images are loaded, and you can
    // quit calling this method.
    loadImages: function () {
        // If there are images left to load
        if (this.imagesIndex < this.imageUrls.length) {
            this.loadImage(this.imageUrls[this.imagesIndex]);
            this.imagesIndex++;
        }
        // Return the percent complete
        return (this.imagesLoaded + this.imagesFailedToLoad) /
            this.imageUrls.length * 100;
    },

    // Call this method to add an image to the queue. The image
    // will be loaded by loadImages().
    queueImage: function (imageUrl) {
        this.imageUrls.push(imageUrl);
    },

    // Drives the game's animation. This method is called by the
    // browser when it's time for the next animation frame.
    animate: function (time) {
        var self = this;
        if (this.paused) {
            // In PAUSE_TIMEOUT (100) ms, call this method again to see
            // if the game is still paused. There's no need to check
            // more frequently.
            setTimeout(
                function () {
                    self.animate.call(self, time);
                },
                this.PAUSE_TIMEOUT
            );

        } else {
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
            window.requestNextAnimationFrame(
                function (time) {
                    self.animate.call(self, time);
                });
        }
    },

    togglePaused: function () {
        var now = getTimeNow();
        this.paused = !this.paused;
        if (this.paused) {
            this.startedPauseAt = now;
        } else { // Not paused
            // Adjust start time, so game starts where it left off when
            // the user paused it.
            this.startTime = this.startTime + now - this.startedPauseAt;
            this.lastTime = now;
        }
    },

    // Update the frame rate, game time, and the last time the
    // application drew an animation frame.
    tick: function (time) {
        this.updateFrameRate(time);
        this.gameTime = (getTimeNow()) - this.startTime;
        this.lastTime = time;
    },

    // Update the frame rate, based on the amount of time it took    
    // for the last animation frame only.
    updateFrameRate: function (time) {
        if (this.lastTime === 0) this.fps = this.STARTING_FPS;
        else this.fps = 1000 / (time - this.lastTime);
    },

    // Clear the entire canvas.
    clearScreen: function () {
        this.context.clearRect(0, 0,
            this.context.canvas.width, this.context.canvas.height);
    },

    // Update all sprites. The sprite update() method invokes all
    // of a sprite's behaviors.
    updateSprites: function (time) {
        for (var i = 0; i < this.sprites.length; ++i) {
            var sprite = this.sprites[i];
            sprite.update(this.context, time);
        }
        ;
    },

    // Paint all visible sprites.
    paintSprites: function (time) {
        for (var i = 0; i < this.sprites.length; ++i) {
            var sprite = this.sprites[i];
            if (sprite.visible)
                sprite.paint(this.context);
        }
    },

    // Given a velocity of some object, calculate the number of pixels
    // to move that object for the current frame.
    pixelsPerFrame: function (time, velocity) {
        // (pixels/second) * (second/frame) = pixels/frame:
        return velocity / this.fps; // pixels/frame
    },

    // High scores.....................................................
    // Returns an array of high scores from local storage.
    getHighScores: function () {
        var key = this.gameName + this.HIGH_SCORES_SUFFIX,
            highScoresString = localStorage[key];
        if (highScoresString == undefined) {
            localStorage[key] = JSON.stringify([]);
        }
        return JSON.parse(localStorage[key]);
    },

    // Sets the high score in local storage.
    setHighScore: function (highScore) {
        var key = this.gameName + this.HIGH_SCORES_SUFFIX,
            highScoresString = localStorage[key];
        highScores.unshift(highScore);
        localStorage[key] = JSON.stringify(highScores);
    },

    clearHighScores: function () {
        localStorage[this.gameName + this.HIGH_SCORES_SUFFIX] =
            JSON.stringify([]);
    },

    // Key listeners...................................................
    // Add a (key, listener) pair to the keyListeners array.
    addKeyListener: function (keyAndListener) {
        this.keyListeners.push(keyAndListener);
    },

    // Given a key, return the associated listener.
    findKeyListener: function (key) {
        var listener = undefined;
        for (var i = 0; i < this.keyListeners.length; ++i) {
            var keyAndListener = this.keyListeners[i],
                currentKey = keyAndListener.key;
            if (currentKey === key) {
                listener = keyAndListener.listener;
            }
        }
        ;
        return listener;
    },

    keyCodeToName: function (keyCode) {
        var key = undefined;
        if (keyCode >= 65 && keyCode <= 90) {
            return String.fromCharCode(keyCode).toLowerCase();
        }
        switch (keyCode) {
            // Add more keys as needed                  
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
    },

    // This method is the callback for key down and key press events.
    keyPressed: function (e) {
        var listener = undefined,
            key = this.keyCodeToName(e.keyCode);
        this.pressedKeys[key] = 1;
        listener = this.findKeyListener(key);
        if (listener) { // Listener is a function
            listener(true); // Invoke the listener function            
        }
    },

    // This method is the callback for key up events.
    keyReleased: function (e) {
        var listener = undefined,
            key = this.keyCodeToName(e.keyCode);
        this.pressedKeys[key] = 0;
        listener = this.findKeyListener(key);
        if (listener) { // Listener is a function
            listener(false); // Invoke the listener function
        }
    },

    // Sound...........................................................    
    canPlayOggVorbis: function () {
        return "" != this.audio.canPlayType('audio/ogg; codecs="vorbis"');
    },

    canPlayMp3: function () {
        return "" != this.audio.canPlayType('audio/mpeg');
    },

    // Returns the first sound available channel.
    getAvailableSoundChannel: function () {
        var audio;
        for (var i = 0; i < this.NUM_SOUND_CHANNELS; ++i) {
            audio = this.soundChannels[i];
            if (audio.played && audio.played.length > 0) {
                if (audio.ended)
                    return audio;
            } else {
                if (!audio.ended)
                    return audio;
            }
        }
        return undefined; // All channels in use
    },

    // Given an identifier, play the associated sound.
    playSound: function (id) {
        var channel = this.getAvailableSoundChannel(),
            element = document.getElementById(id);
        if (channel && element) {
            channel.src = element.src === '' ?
                element.currentSrc : element.src;
            channel.load();
            channel.play();
        }
    },

    // Sprites.........................................................
    // Add a sprite to the game. The game engine will update the sprite
    // and paint it (if it's visible) in the animate() method.
    addSprite: function (sprite) {
        this.sprites.push(sprite);
    },
    // It's probably a good idea not to access sprites directly,
    // because it's better to write generalized code that deals with
    // all sprites, so this method should be used sparingly.
    getSprite: function (name) {
        for (var i in this.sprites) {
            if (this.sprites[i].name === name)
                return this.sprites[i];
        }
        return null;
    },

    getAllSprites: function (name) {
        var list = [];
        for (var i in this.sprites) {
            if (!name || this.sprites[i].name === name)
                list.push(this.sprites[i]);
        }
        return list;
    },

    getSpriteCount : function(type){
        var count = 0;
        for(var i in this.sprites){
            if(this.sprites[i].name == type)
                count++;
        }
        return count;
    },

    removeSprite: function (sprite) {
        for (var i in this.sprites) {
            if (this.sprites[i] == sprite) {
                this.sprites.splice(i, 1);
                return;
            }
        }
    },

    removeAllSprites: function () {
        this.sprites = [];
    },

    // Override the following methods as desired. animate() calls
    // the methods in the order they are listed.
    startAnimate: function (time) {
    },

    paintUnderSprites: function () {
    },

    paintOverSprites: function () {
    },

    endAnimate: function () {
    },

    middle: function () {
        return {
            x: this.width() / 2,
            y: this.height() / 2
        };
    },

    width: function () {
        return this.context.canvas.width;
    },

    height: function () {
        return this.context.canvas.height;
    },

    distance: function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
};


