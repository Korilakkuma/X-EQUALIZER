import { X } from 'xsound';
import { FREQUENCIES } from './config';

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
      this.filters[i].Q.value = Math.SQRT1_2;
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

  public param(fc: 32 | 62.5 | 125 | 250 | 500 | 1000 | 2000 | 4000 | 8000 | 16000, dB: number): void {
    const index = FREQUENCIES.indexOf(fc);

    if (index === -1) {
      return;
    }

    this.filters[index].gain.value = dB;
  }

  /** @override */
  connect(): GainNode {
    return this.input;
  }

  /** @override */
  params() {
    return {
      32: this.filters[0].gain.value,
      62: this.filters[1].gain.value,
      125: this.filters[2].gain.value,
      250: this.filters[3].gain.value,
      500: this.filters[4].gain.value,
      1000: this.filters[5].gain.value,
      2000: this.filters[6].gain.value,
      4000: this.filters[7].gain.value,
      8000: this.filters[8].gain.value,
      16000: this.filters[9].gain.value
    };
  }
}
