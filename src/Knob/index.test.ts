import { Knob } from '/src/Knob';

const mockCanvas = (canvas: HTMLCanvasElement) => {
  Object.defineProperty(canvas, 'getContext', {
    configurable: true,
    writable: false,
    value: () => {
      return {
        arc: jest.fn(() => {}),
        beginPath: jest.fn(() => {}),
        fill: jest.fn(() => {}),
        fillRect: jest.fn(() => {}),
        fillText: jest.fn(() => {}),
        lineTo: jest.fn(() => {}),
        moveTo: jest.fn(() => {}),
        stroke: jest.fn(() => {})
      };
    }
  });
};

describe(`${Knob.name}`, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should draw arc path', () => {
    const canvas = document.createElement('canvas');

    mockCanvas(canvas);

    const context = canvas.getContext('2d');

    // HACK:
    if (context === null) {
      return;
    }

    const knob = new Knob(canvas, context);

    knob.drawCircle(12, 24, false);

    expect(context.beginPath).toHaveBeenCalledTimes(1);
    expect(context.arc).toHaveBeenCalledTimes(1);
    expect(context.arc).toHaveBeenCalledWith(12, 24, 12, 0, 2 * Math.PI, true);
    expect(context.fill).toHaveBeenCalledTimes(1);

    knob.drawCircle(12, 24, true);

    expect(context.beginPath).toHaveBeenCalledTimes(2);
    expect(context.arc).toHaveBeenCalledTimes(2);
    expect(context.arc).toHaveBeenCalledWith(12, 24, 24, 0, 2 * Math.PI, true);
    expect(context.fill).toHaveBeenCalledTimes(2);
  });

  test('should draw line', () => {
    const canvas = document.createElement('canvas');

    mockCanvas(canvas);

    const context = canvas.getContext('2d');

    // HACK:
    if (context === null) {
      return;
    }

    const knob = new Knob(canvas, context);

    knob.drawLine(1, 1, 2, 2);

    expect(context.beginPath).toHaveBeenCalledTimes(1);
    expect(context.moveTo).toHaveBeenCalledTimes(1);
    expect(context.moveTo).toHaveBeenCalledWith(1, 1);
    expect(context.lineTo).toHaveBeenCalledTimes(1);
    expect(context.lineTo).toHaveBeenCalledWith(2, 2);
    expect(context.stroke).toHaveBeenCalledTimes(1);
  });

  test('should draw cross', () => {
    const canvas = document.createElement('canvas');

    mockCanvas(canvas);

    const context = canvas.getContext('2d');

    // HACK:
    if (context === null) {
      return;
    }

    const knob = new Knob(canvas, context);

    knob.drawCross('2 dB', 4, 5);

    expect(context.fillText).toHaveBeenCalledTimes(1);
    expect(context.fillText).toHaveBeenCalledWith('2 dB', 4, 16);
  });
});
