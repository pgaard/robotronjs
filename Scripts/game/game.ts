////<reference path="animation.ts" />
var getTimeNow = function () : number {
    return Date.now();
};

interface KeyListenerCallback { (pressed: boolean) : void }

interface IKeyListener {
    key: string;
    listener: KeyListenerCallback 
}

class Game {
    context: CanvasRenderingContext2D;
    gameName: string;
    sprites: Sprite[];
    keyListeners: IKeyListener[];
    images: { [index: string]: HTMLImageElement };
    spritesheet: HTMLImageElement;
    imageUrls: string[];
    imagesLoaded: number;
    imagesFailedToLoad: number;
    imagesIndex: number;
    score: number;
    startTime: number;
    lastTime: number;
    gameTime: number;
    fps: number;
    STARTING_FPS: number;
    paused: boolean;
    startedPauseAt: number;
    PAUSE_TIMEOUT: number;
    soundOn: boolean;
    soundChannels: HTMLAudioElement[];
    audio: HTMLAudioElement;
    NUM_SOUND_CHANNELS: number;
    pressedKeys: { [index:string]: boolean };
    HIGH_SCORES_SUFFIX: string;
    dead: boolean;
    left: number;
    right: number;
    top: number;
    bottom: number;

    constructor(gameName: string, canvasId: string) {
        var canvas = <HTMLCanvasElement> document.getElementById(canvasId),
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

        this.fps = 0;
        this.STARTING_FPS = 60;

        this.paused = false;
        this.PAUSE_TIMEOUT = 100;

        this.soundOn = true;
        this.soundChannels = [];
        this.audio = new Audio();
        this.NUM_SOUND_CHANNELS = 10;
        this.HIGH_SCORES_SUFFIX = "highscores"

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
    start() {
        var self = this;
        // The this variable is the game
        this.startTime = getTimeNow(); // Record game's startTime
        // Starts the animation
        requestNextAnimationFrame(
            function (time) {
                // The this variable in this function is the window.
                self.animate.call(self, time); // self is the game
            });
    }

    getImage(imageUrl: string) {
        return this.images[imageUrl];
    }

    imageLoadedCallback(e: Event) {
        this.imagesLoaded++;
    }

    // This method is called by loadImage() when
    // an image does not load successfully.
    imageLoadErrorCallback(e: Event) {
        this.imagesFailedToLoad++;
    }

    // Loads a particular image
    loadImage(imageUrl: string) {
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
    }

    // You call this method repeatedly to load images that have been
    // queued (by calling queueImage()). This method returns the
    // percent of the game's images that have been processed. When
    // the method returns 100, all images are loaded, and you can
    // quit calling this method.
    loadImages() {
        // If there are images left to load
        if (this.imagesIndex < this.imageUrls.length) {
            this.loadImage(this.imageUrls[this.imagesIndex]);
            this.imagesIndex++;
        }
        // Return the percent complete
        return (this.imagesLoaded + this.imagesFailedToLoad) /
            this.imageUrls.length * 100;
    }

    // Call this method to add an image to the queue. The image
    // will be loaded by loadImages().
    queueImage(imageUrl: string) {
        this.imageUrls.push(imageUrl);
    }

    // Drives the game's animation. This method is called by the
    // browser when it's time for the next animation frame.
    animate(time: number) {
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
            requestNextAnimationFrame(
                function (time) {
                    self.animate.call(self, time);
                });
        }
    }

    togglePaused() {
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
    }

    // Update the frame rate, game time, and the last time the
    // application drew an animation frame.
    tick(time: number) {
        this.updateFrameRate(time);
        this.gameTime = (getTimeNow()) - this.startTime;
        this.lastTime = time;
    }

    // Update the frame rate, based on the amount of time it took    
    // for the last animation frame only.
    updateFrameRate(time: number) {
        if (this.lastTime === 0) this.fps = this.STARTING_FPS;
        else this.fps = 1000 / (time - this.lastTime);
    }

    // Clear the entire canvas.
    clearScreen() {
        this.context.clearRect(0, 0,
            this.context.canvas.width, this.context.canvas.height);
    }

    // Update all sprites. The sprite update() method invokes all
    // of a sprite's behaviors.
    updateSprites(time: number) {
        for (var i = 0; i < this.sprites.length; ++i) {
            var sprite = this.sprites[i];
            sprite.update(this.context, time);
        }
        ;
    }

    // Paint all visible sprites.
    paintSprites(time: number) {
        for (var i = 0; i < this.sprites.length; ++i) {
            var sprite = this.sprites[i];
            if (sprite.visible)
                sprite.paint(this.context);
        }
    }

    // Given a velocity of some object, calculate the number of pixels
    // to move that object for the current frame.
    pixelsPerFrame(time: number, velocity: number) {
        // (pixels/second) * (second/frame) = pixels/frame:
        return velocity / this.fps; // pixels/frame
    }

    // High scores.....................................................
    // Returns an array of high scores from local storage.
    getHighScores() {
        var key = this.gameName + this.HIGH_SCORES_SUFFIX,
            highScoresString = localStorage[key];
        if (highScoresString == undefined) {
            localStorage[key] = JSON.stringify([]);
        }
        return JSON.parse(localStorage[key]);
    }

    // Sets the high score in local storage.
    setHighScore(highScore: number) {
        var key = this.gameName + this.HIGH_SCORES_SUFFIX,
            highScores = localStorage[key];
        highScores.unshift(highScore);
        localStorage[key] = JSON.stringify(highScores);
    }

    clearHighScores() {
        localStorage[this.gameName + this.HIGH_SCORES_SUFFIX] =
        JSON.stringify([]);
    }

    // Key listeners...................................................
    // Add a (key, listener) pair to the keyListeners array.
    addKeyListener(keyAndListener: IKeyListener){
        this.keyListeners.push(keyAndListener);
    }

    // Given a key, return the associated listener.
    findKeyListener(key: string) {
        var listener: KeyListenerCallback;
        for (var i = 0; i < this.keyListeners.length; ++i) {
            var keyAndListener = this.keyListeners[i],
                currentKey = keyAndListener.key;
            if (currentKey === key) {
                listener = keyAndListener.listener;
            }
        }
        ;
        return listener;
    }

    keyCodeToName(keyCode: number) {
        var key: string;
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
    }

    // This method is the callback for key down and key press events.
    keyPressed(e: KeyboardEvent) {
        var listener: KeyListenerCallback,
            key = this.keyCodeToName(e.keyCode);
        this.pressedKeys[key] = true;
        listener = this.findKeyListener(key);
        if (listener) { // Listener is a function
            listener(true); // Invoke the listener function            
        }
    }

    // This method is the callback for key up events.
    keyReleased(e: KeyboardEvent) {
        var listener : KeyListenerCallback,
            key = this.keyCodeToName(e.keyCode);
        this.pressedKeys[key] = false;
        listener = this.findKeyListener(key);
        if (listener) { // Listener is a function
            listener(false); // Invoke the listener function
        }
    }

    // Sound...........................................................    
    canPlayOggVorbis() {
        return "" != this.audio.canPlayType('audio/ogg; codecs="vorbis"');
    }

    canPlayMp3() {
        return "" != this.audio.canPlayType('audio/mpeg');
    }

    // Returns the first sound available channel.
    getAvailableSoundChannel() {
        var audio:  HTMLAudioElement;
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
    }

    // Given an identifier, play the associated sound.
    playSound(id: string) {
        var channel = this.getAvailableSoundChannel(),
            element = <HTMLAudioElement> document.getElementById(id);
        if (channel && element) {
            channel.src = element.src === '' ?
                element.currentSrc : element.src;
            channel.load();
            channel.play();
        }
    }

    // Sprites.........................................................
    // Add a sprite to the game. The game engine will update the sprite
    // and paint it (if it's visible) in the animate() method.
    addSprite(sprite: Sprite) {
        this.sprites.push(sprite);
    }
    // It's probably a good idea not to access sprites directly,
    // because it's better to write generalized code that deals with
    // all sprites, so this method should be used sparingly.
    getSprite(name: string) {
        for (var i in this.sprites) {
            if (this.sprites[i].name === name)
                return this.sprites[i];
        }
        return null;
    }

    getAllSprites(nameOrFunc?: any) {
        var list: Sprite[] = [];
        if (typeof(nameOrFunc) == "function") {
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
    }

    getSpriteCount(type: string) : number {
        var count = 0;
        for (var i in this.sprites) {
            if (this.sprites[i].name == type)
                count++;
        }
        return count;
    }

    removeSprite(sprite: Sprite) {
        for (var i in this.sprites) {
            if (this.sprites[i] == sprite) {
                this.sprites.splice(i, 1);
                return;
            }
        }
    }

    removeAllSprites() {
        this.sprites = [];
    }

    // Override the following methods as desired. animate() calls
    // the methods in the order they are listed.
    startAnimate(time: number) {
    }

    paintUnderSprites() {
    }

    paintOverSprites() {
    }

    endAnimate() {
    }

    middle() {
        return {
            x: this.width() / 2,
            y: this.height() / 2
        };
    }

    width() {
        return this.context.canvas.width;
    }

    height() {
        return this.context.canvas.height;
    }

    distance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
}


