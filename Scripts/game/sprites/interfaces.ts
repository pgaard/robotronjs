interface ManPositionFunction {
    (): { left: number; top: number }
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
