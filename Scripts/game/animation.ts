﻿interface RequestNextFrame {
    (callback: FrameRequestCallback): number;
}

var requestNextAnimationFrame: RequestNextFrame =
(function () {
    var originalWebkitMethod: Function,
        wrapper: Function = undefined,
        callback: Function = undefined,
        geckoVersion = "0",
        userAgent = navigator.userAgent,
        index = 0,
        self = this,
        windowAny = <any>window;

    // Workaround for Chrome 10 bug where Chrome
    // does not pass the time to the animation function
    if (windowAny.webkitRequestAnimationFrame) {
        // Define the wrapper
        wrapper = function (time: number) {
            if (time === undefined) {
                time = +new Date();
            }
            self.callback(time);
        };
        // Make the switch
        originalWebkitMethod = windowAny.webkitRequestAnimationFrame;
        windowAny.webkitRequestAnimationFrame =
        function (callback: Function, element: HTMLElement) {
                self.callback = callback;
                // Browser calls wrapper; wrapper calls callback
            originalWebkitMethod(wrapper, element);
            };
    }
    // Workaround for Gecko 2.0, which has a bug in
    // mozRequestAnimationFrame() that restricts animations
    // to 30-40 fps.
    if (windowAny.mozRequestAnimationFrame) {
        // Check the Gecko version. Gecko is used by browsers
        // other than Firefox. Gecko 2.0 corresponds to
        // Firefox 4.0.
        index = userAgent.indexOf('rv:');
        if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);
            if (geckoVersion === '2.0') {
                // Forces the return statement to fall through
                // to the setTimeout() function.
                (<any>window).mozRequestAnimationFrame = undefined;
            }
        }
    }
            
    return window.requestAnimationFrame ||
        windowAny.webkitRequestAnimationFrame ||
        windowAny.mozRequestAnimationFrame ||
        windowAny.oRequestAnimationFrame ||
        windowAny.msRequestAnimationFrame ||
        function (callback: Function, element: HTMLElement) {
            var start: number, finish: number;
            window.setTimeout(function () {
                start = +new Date();
                callback(start);
                finish = +new Date();
                self.timeout = 1000 / 60 - (finish - start);
            }, self.timeout);
        };
}
)();