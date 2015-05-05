interface ManPositionFunction {
    (): { left: number; top: number }
}

interface RgbFunction {
    (): string;
}

interface WaveDurationFunction {
    (): number;
}

interface ISpriteCells {
    [index: string]: {
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
}

interface Point {
    x: number;
    y: number;
}