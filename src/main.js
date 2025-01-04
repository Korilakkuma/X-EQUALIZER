(() => {
  const FREQUENCIES = [62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  const PRESETS = {
    flat: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    acoustic: [6, 5, 1, 3, 2, 4, 5, 4, 2],
    bassbooster: [5, 3, 2, 1, 0, 0, 0, 0, 0],
    bassreducer: [-5, -3, -2, -1, 0, 0, 0, 0, 0],
    classical: [4, 3, 2, -1, -1, 0, 2, 3, 4],
    dance: [7, 6, 0, 2, 4, 6, 5, 4, 0],
    deep: [3, 2, 0, 3, 2, 1, -2, -4, -6],
    electronic: [5, 1, 0, -2, 2, 1, 1, 2, 6],
    hiphop: [5, 2, 3, -2, -2, 2, -1, 2, 3],
    latin: [3, 0, 0, -2, -2, -2, 0, 3, 5],
    loudness: [5, 0, 0, -2, 0, -1, -6, 6, 2],
    lounge: [-1, 0, 2, 5, 3, 0, -2, 2, 1],
    piano: [2, 0, 2, 3, 1, 3, 5, 3, 4],
    pop: [-1, 0, 2, 5, 5, 2, 0, -1, -2],
    rb: [7, 6, 2, -3, -1, 3, 3, 3, 4],
    rock: [5, 3, 2, -1, -2, 0, 3, 4, 5],
    treblebooster: [0, 0, 0, 0, 1, 2, 3, 5, 6],
    treblereducer: [0, 0, 0, 0, -1, -2, -3, -5, -6],
    vocalbooster: [-3, -3, 2, 5, 5, 3, 2, 0, -2]
    // perfect      : [ 9,  7,  6,  5,  7,  9],
    // explosion    : [ 9,  7,  6,  5,  7,  4],
  };

  const MIN_FREQUENCY = 20;
  const MAX_FREQUENCY = 20000;

  class GraphicEqualizer extends X.Effector {
    filters = [];

    constructor(context) {
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

    param(fc, dB) {
      const index = FREQUENCIES.indexOf(fc);

      if (index === -1) {
        return;
      }

      this.filters[index].gain.value = dB;
    }

    /** @override */
    connect() {
      return this.input;
    }

    /** @override */
    params() {
      return {
        62: this.filters[0].gain.value,
        125: this.filters[1].gain.value,
        250: this.filters[2].gain.value,
        500: this.filters[3].gain.value,
        1000: this.filters[4].gain.value,
        2000: this.filters[5].gain.value,
        4000: this.filters[6].gain.value,
        8000: this.filters[7].gain.value,
        16000: this.filters[8].gain.value
      };
    }
  }

  class Knob {
    constructor(canvas, context) {
      this.canvas = canvas;
      this.context = context;
    }

    drawCircle(x, y, isMouseDown) {
      const radius = isMouseDown ? 24 : 12;

      this.context.fillStyle = '#fdfdfd';
      this.context.beginPath();
      this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
      this.context.fill();
    }

    drawLine(startX, startY, endX, endY) {
      this.context.lineWidth = 1;
      this.context.strokeStyle = '#fdfdfd';
      this.context.beginPath();
      this.context.moveTo(startX, startY);
      this.context.lineTo(endX, endY);
      this.context.stroke();
    }

    drawCross(text, x, y) {
      const w = this.canvas.width;
      const h = this.canvas.height;

      const offset = 24;

      this.context.fillStyle = '#fdfdfd';
      this.context.fillRect(x, h, 1, 0 - (h - offset));
      this.context.fillRect(0, y, w, 1);

      const fontSize = 16;

      this.context.font = `${fontSize}px 'Lato'`;
      this.context.fillStyle = '#fdfdfd';
      this.context.textAlign = 'center';
      this.context.fillText(text, x, fontSize);
    }
  }

  function main() {
    const visualizerCanvasId = 'visualizer-canvas';
    const controllerCanvasId = 'controller-canvas';
    const selectPresetId = 'select-preset';

    const visualizerCanvas = document.getElementById(visualizerCanvasId);
    const controllerCanvas = document.getElementById(controllerCanvasId);
    const select = document.getElementById(selectPresetId);

    if (visualizerCanvas && controllerCanvas && select) {
      if (visualizerCanvas.hasAttribute('hidden')) {
        visualizerCanvas.removeAttribute('hidden');
      } else {
        visualizerCanvas.setAttribute('hidden', 'hidden');
      }

      if (controllerCanvas.hasAttribute('hidden')) {
        controllerCanvas.removeAttribute('hidden');
      } else {
        controllerCanvas.setAttribute('hidden', 'hidden');
      }

      if (select.hasAttribute('hidden')) {
        select.removeAttribute('hidden');
      } else {
        select.setAttribute('hidden', 'hidden');
      }
    } else {
      X.setup()
        .then(() => {
          const video = document.querySelector('video');

          if (!video) {
            return;
          }

          const visualizerCanvas = document.createElement('canvas');
          const controllerCanvas = document.createElement('canvas');
          const select = document.createElement('select');

          const context = controllerCanvas.getContext('2d');

          if (!context) {
            return;
          }

          const equalizer = X('media')
            .setup({
              media: video,
              autoplay: true
            })
            .install(GraphicEqualizer);

          // for Visualizer
          visualizerCanvas.width = window.innerWidth;
          visualizerCanvas.height = window.innerHeight;
          visualizerCanvas.setAttribute('id', visualizerCanvasId);

          document.body.appendChild(visualizerCanvas);

          const knob = new Knob(controllerCanvas, context);

          X('media')
            .module('analyser')
            .domain('fft')
            .setup(visualizerCanvas)
            .activate()
            .param({
              interval: -1,
              scale: 'logarithmic',
              styles: {
                shape: 'rect',
                gradients: [
                  { offset: 0, color: 'rgba(255, 0, 0, 0.0)' },
                  { offset: 1, color: 'rgba(255, 0, 0, 1.0)' }
                ],
                width: 1,
                grid: 'none',
                text: 'none',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              }
            });

          // for Graphic Equalizer
          controllerCanvas.width = window.innerWidth;
          controllerCanvas.height = window.innerHeight;
          controllerCanvas.setAttribute('id', controllerCanvasId);

          document.body.appendChild(controllerCanvas);

          const middle = Math.trunc(controllerCanvas.height / 2);
          const fftSize = X('media').module('analyser').param('fftSize');
          const frequencyResolution = X.SAMPLE_RATE / fftSize;
          const drawnSize = X('media').module('analyser').domain('fft').param('size');

          const base = Math.log10(MAX_FREQUENCY / MIN_FREQUENCY);

          const f62 = Math.log10(FREQUENCIES[0] / MIN_FREQUENCY) / base;
          const f125 = Math.log10(FREQUENCIES[1] / MIN_FREQUENCY) / base;
          const f250 = Math.log10(FREQUENCIES[2] / MIN_FREQUENCY) / base;
          const f500 = Math.log10(FREQUENCIES[3] / MIN_FREQUENCY) / base;
          const f1000 = Math.log10(FREQUENCIES[4] / MIN_FREQUENCY) / base;
          const f2000 = Math.log10(FREQUENCIES[5] / MIN_FREQUENCY) / base;
          const f4000 = Math.log10(FREQUENCIES[6] / MIN_FREQUENCY) / base;
          const f8000 = Math.log10(FREQUENCIES[7] / MIN_FREQUENCY) / base;
          const f16000 = Math.log10(FREQUENCIES[8] / MIN_FREQUENCY) / base;

          const widthOfRect = window.innerWidth / (FREQUENCIES.length + 1);

          const f62X = Math.trunc(1 * widthOfRect);
          const f125X = Math.trunc(2 * widthOfRect);
          const f250X = Math.trunc(3 * widthOfRect);
          const f500X = Math.trunc(4 * widthOfRect);
          const f1000X = Math.trunc(5 * widthOfRect);
          const f2000X = Math.trunc(6 * widthOfRect);
          const f4000X = Math.trunc(7 * widthOfRect);
          const f8000X = Math.trunc(8 * widthOfRect);
          const f16000X = Math.trunc(9 * widthOfRect);

          let f62Y = middle;
          let f125Y = middle;
          let f250Y = middle;
          let f500Y = middle;
          let f1000Y = middle;
          let f2000Y = middle;
          let f4000Y = middle;
          let f8000Y = middle;
          let f16000Y = middle;

          let isMouseDown = false;

          const onMousedown = () => {
            isMouseDown = true;
          };

          const onMousemove = (event) => {
            // const x = event.pageX - window.pageXOffset;
            // const y = event.pageY - window.pageYOffset;

            const x = event.clientX;
            const y = event.clientY;
            const w = controllerCanvas.width;
            const h = controllerCanvas.height;
            const maxdB = 24;

            const rate = (middle - y) / middle;
            const dB = rate * maxdB;

            const className = 'on-controller';

            controllerCanvas.classList.remove(className);
            context.clearRect(0, 0, w, h);

            // Draw controllers
            // 62.5 Hz
            knob.drawLine(0, middle, f62X, f62Y);
            knob.drawCircle(f62X, f62Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[0]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(0, middle, f62X, y);
                knob.drawCircle(f62X, y, true);

                f62Y = y;

                equalizer.param(FREQUENCIES[0], 2 * dB);
              }
            }

            // 125 Hz
            knob.drawLine(f62X, f62Y, f125X, f125Y);
            knob.drawCircle(f125X, f125Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[1]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f62X, f62Y, f125X, y);
                knob.drawCircle(f125X, y, true);

                f125Y = y;

                equalizer.param(FREQUENCIES[1], dB);
              }
            }

            // 250 Hz
            knob.drawLine(f125X, f125Y, f250X, f250Y);
            knob.drawCircle(f250X, f250Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[2]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f125X, f125Y, f250X, y);
                knob.drawCircle(f250X, y, true);

                f250Y = y;

                equalizer.param(FREQUENCIES[2], dB);
              }
            }

            // 500 Hz
            knob.drawLine(f250X, f250Y, f500X, f500Y);
            knob.drawCircle(f500X, f500Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[3]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f250X, f250Y, f500X, y);
                knob.drawCircle(f500X, y, true);

                f500Y = y;

                equalizer.param(FREQUENCIES[3], dB);
              }
            }

            // 1000 Hz
            knob.drawLine(f500X, f500Y, f1000X, f1000Y);
            knob.drawCircle(f1000X, f1000Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[4]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f500X, f500Y, f1000X, y);
                knob.drawCircle(f1000X, y, true);

                f1000Y = y;

                equalizer.param(FREQUENCIES[4], dB);
              }
            }

            // 2000 Hz
            knob.drawLine(f1000X, f1000Y, f2000X, f2000Y);
            knob.drawCircle(f2000X, f2000Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[5]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f1000X, f1000Y, f2000X, y);
                knob.drawCircle(f2000X, y, true);

                f2000Y = y;

                equalizer.param(FREQUENCIES[5], dB);
              }
            }

            // 4000 Hz
            knob.drawLine(f2000X, f2000Y, f4000X, f4000Y);
            knob.drawCircle(f4000X, f4000Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[6]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f2000X, f2000Y, f4000X, y);
                knob.drawCircle(f4000X, y, true);

                f4000Y = y;

                equalizer.param(FREQUENCIES[6], dB);
              }
            }

            // 8000 Hz
            knob.drawLine(f4000X, f4000Y, f8000X, f8000Y);
            knob.drawCircle(f8000X, f8000Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[7]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f4000X, f4000Y, f8000X, y);
                knob.drawCircle(f8000X, y, true);

                f8000Y = y;

                equalizer.param(FREQUENCIES[7], dB);
              }
            }

            // 16000 Hz
            knob.drawLine(f8000X, f8000Y, f16000X, f16000Y);
            knob.drawCircle(f16000X, f16000Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[8]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f8000X, f8000Y, f16000X, y);
                knob.drawCircle(f16000X, y, true);

                f16000Y = y;

                equalizer.param(FREQUENCIES[8], dB);
              }
            }

            knob.drawLine(f16000X, f16000Y, window.innerWidth, middle);
          };

          const onMouseup = () => {
            isMouseDown = false;
          };

          knob.drawLine(0, f62Y, f125X, f125Y);
          knob.drawLine(f125X, f125Y, f250X, f250Y);
          knob.drawLine(f250X, f250Y, f500X, f500Y);
          knob.drawLine(f500X, f500Y, f1000X, f1000Y);
          knob.drawLine(f1000X, f1000Y, f2000X, f2000Y);
          knob.drawLine(f2000X, f2000Y, f4000X, f4000Y);
          knob.drawLine(f4000X, f4000Y, f8000X, f8000Y);
          knob.drawLine(f16000X, middle, window.innerWidth, middle);

          knob.drawCircle(f62X, f62Y, false);
          knob.drawCircle(f125X, f125Y, false);
          knob.drawCircle(f250X, f250Y, false);
          knob.drawCircle(f500X, f500Y, false);
          knob.drawCircle(f1000X, f1000Y, false);
          knob.drawCircle(f2000X, f2000Y, false);
          knob.drawCircle(f4000X, f4000Y, false);
          knob.drawCircle(f8000X, f8000Y, false);
          knob.drawCircle(f16000X, f16000Y, false);

          controllerCanvas.addEventListener('mousedown', onMousedown, false);
          controllerCanvas.addEventListener('mousemove', onMousemove, true);
          controllerCanvas.addEventListener('mouseup', onMouseup, false);

          const onResize = () => {
            visualizerCanvas.width = window.innerWidth;
            visualizerCanvas.height = window.innerHeight;
            controllerCanvas.width = window.innerWidth;
            controllerCanvas.height = window.innerHeight;

            window.removeEventListener('resize', onResize, false);
          };

          window.addEventListener('resize', onResize, false);

          select.setAttribute('id', selectPresetId);

          const fragment = document.createDocumentFragment();

          Object.keys(PRESETS).forEach((presetName) => {
            const option = document.createElement('option');

            option.value = presetName;
            option.textContent = presetName.toUpperCase();

            fragment.appendChild(option);
          });

          select.appendChild(fragment);

          document.body.appendChild(select);

          const onChangePreset = (event) => {
            if (!(event.currentTarget instanceof HTMLSelectElement)) {
              return;
            }

            const presetValues = PRESETS[event.currentTarget.value];

            for (let i = 0, len = presetValues.length; i < len; i++) {
              equalizer.param(FREQUENCIES[i], presetValues[i]);

              const maxdB = 18;
              const y = 0 - (presetValues[i] / maxdB) * middle + middle;

              switch (i) {
                case 0:
                  f62Y = y;
                  break;
                case 1:
                  f125Y = y;
                  break;
                case 2:
                  f250Y = y;
                  break;
                case 3:
                  f500Y = y;
                  break;
                case 4:
                  f1000Y = y;
                  break;
                case 5:
                  f2000Y = y;
                  break;
                case 6:
                  f4000Y = y;
                  break;
                case 7:
                  f8000Y = y;
                  break;
                case 8:
                  f16000Y = y;
                  break;
                default:
                  break;
              }
            }
          };

          select.addEventListener('change', onChangePreset, false);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  }

  main();
})();
