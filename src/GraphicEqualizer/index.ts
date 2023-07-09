import { X } from 'xsound';

export type CenterFrequency = 125 | 250 | 500 | 1000 | 2000 | 4000 | 8000;
export type Preset = { [presetName: string]: number[] };

export const FREQUENCIES: CenterFrequency[] = [125, 250, 500, 1000, 2000, 4000, 8000];

export const PRESETS: Preset = {
  flat: [0, 0, 0, 0, 0, 0],
  perfect: [9, 7, 6, 5, 7, 9],
  explosion: [9, 7, 6, 5, 7, 4],
  acoustic: [5, 1, 2, 3, 4, 2],
  bassbooster: [3, 2, 1, 0, 0, 0],
  bassreducer: [-4, -3, -1, 0, 0, 0],
  deep: [2, 1, 3, 2, 1, -2],
  hiphop: [2, 3, -2, -2, 2, -1],
  latin: [0, 0, -2, -2, -2, 0],
  loudness: [0, 0, -2, 0, -1, -5],
  lounge: [-1, -2, 4, 2, 0, -2],
  piano: [0, 2, 3, 1, 3, 4],
  rb: [6, 2, -3, -2, 2, 3],
  treblebooster: [0, 0, 0, 1, 3, 4],
  treblereducer: [0, 0, 0, -2, -3, -4]
};

type GraphicEqualizerParams = {
  125?: number;
  250?: number;
  500?: number;
  1000?: number;
  2000?: number;
  4000?: number;
  8000?: number;
};

export class GraphicEqualizer extends X.Effector {
  private filters: BiquadFilterNode[] = [];

  constructor(context: AudioContext) {
    super(context);

    this.context = context;

    this.filters = new Array(FREQUENCIES.length);

    for (let i = 0, len = this.filters.length; i < len; i++) {
      this.filters[i] = this.context.createBiquadFilter();
      this.filters[i].type = 'peaking';
      this.filters[i].frequency.value = FREQUENCIES[i];
      this.filters[i].Q.value = 2;
      this.filters[i].gain.value = 0;
    }

    this.input.connect(this.filters[0]);

    for (let i = 0, len = this.filters.length; i < len; i++) {
      if (i < len - 1) {
        this.filters[i].connect(this.filters[i + 1]);
      } else {
        this.filters[i].connect(this.output);
      }
    }
  }

  public param(fc: CenterFrequency, dB: number): void {
    const index = FREQUENCIES.indexOf(fc);

    if (index === -1) {
      return;
    }

    this.filters[index].gain.value = dB;
  }

  /** @override */
  public override connect(): GainNode {
    return this.input;
  }

  /** @override */
  public override params(): Required<GraphicEqualizerParams> {
    return {
      125: this.filters[0].gain.value,
      250: this.filters[1].gain.value,
      500: this.filters[2].gain.value,
      1000: this.filters[3].gain.value,
      2000: this.filters[4].gain.value,
      4000: this.filters[5].gain.value,
      8000: this.filters[6].gain.value
    };
  }
}
