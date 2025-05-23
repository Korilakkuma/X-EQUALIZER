(() => {
  const FREQUENCIES = [62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  const PRESETS = {
    flat: [0, 0, 0, 0, 0, 0, 0, 0, 0],
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
              scale: 'linear',
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
          const fsDivN = X.SAMPLE_RATE / fftSize;
          const drawnSize = X('media').module('analyser').domain('fft').param('size');

          const f62 = Math.log10(FREQUENCIES[0] / MIN_FREQUENCY) / Math.log10(MAX_FREQUENCY / MIN_FREQUENCY);
          const f125 = Math.log10(FREQUENCIES[1] / MIN_FREQUENCY) / Math.log10(MAX_FREQUENCY / MIN_FREQUENCY);
          const f250 = Math.log10(FREQUENCIES[2] / MIN_FREQUENCY) / Math.log10(MAX_FREQUENCY / MIN_FREQUENCY);
          const f500 = Math.log10(FREQUENCIES[3] / MIN_FREQUENCY) / Math.log10(MAX_FREQUENCY / MIN_FREQUENCY);
          const f1000 = Math.log10(FREQUENCIES[4] / MIN_FREQUENCY) / Math.log10(MAX_FREQUENCY / MIN_FREQUENCY);
          const f2000 = Math.log10(FREQUENCIES[5] / MIN_FREQUENCY) / Math.log10(MAX_FREQUENCY / MIN_FREQUENCY);
          const f4000 = Math.log10(FREQUENCIES[6] / MIN_FREQUENCY) / Math.log10(MAX_FREQUENCY / MIN_FREQUENCY);
          const f8000 = Math.log10(FREQUENCIES[7] / MIN_FREQUENCY) / Math.log10(MAX_FREQUENCY / MIN_FREQUENCY);
          const f16000 = Math.log10(FREQUENCIES[8] / MIN_FREQUENCY) / Math.log10(MAX_FREQUENCY / MIN_FREQUENCY);

          const widthOfRect = controllerCanvas.width / drawnSize;

          const f125X = Math.trunc(widthOfRect * f125);
          const f250X = Math.trunc(widthOfRect * f250);
          const f500X = Math.trunc(widthOfRect * f500);
          const f1000X = Math.trunc(widthOfRect * f1000);
          const f2000X = Math.trunc(widthOfRect * f2000);
          const f4000X = Math.trunc(widthOfRect * f4000);

          let f125Y = middle;
          let f250Y = middle;
          let f500Y = middle;
          let f1000Y = middle;
          let f2000Y = middle;
          let f4000Y = middle;

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
            // 125 Hz
            knob.drawLine(0, middle, f125X, f125Y);
            knob.drawCircle(f125X, f125Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[0]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(0, middle, f125X, y);
                knob.drawCircle(f125X, y, true);

                f125Y = y;

                equalizer.param(FREQUENCIES[0], 2 * dB);
              }
            }
            // 250 Hz
            knob.drawLine(f125X, f125Y, f250X, f250Y);
            knob.drawCircle(f250X, f250Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[1]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f125X, f125Y, f250X, y);
                knob.drawCircle(f250X, y, true);

                f250Y = y;

                equalizer.param(FREQUENCIES[1], dB);
              }
            }

            // 500 Hz
            knob.drawLine(f250X, f250Y, f500X, f500Y);
            knob.drawCircle(f500X, f500Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[2]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f250X, f250Y, f500X, y);
                knob.drawCircle(f500X, y, true);

                f500Y = y;

                equalizer.param(FREQUENCIES[2], dB);
              }
            }
            // 1000 Hz
            knob.drawLine(f500X, f500Y, f1000X, f1000Y);
            knob.drawCircle(f1000X, f1000Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[3]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f500X, f500Y, f1000X, y);
                knob.drawCircle(f1000X, y, true);

                f1000Y = y;

                equalizer.param(FREQUENCIES[3], dB);
              }
            }

            // 2000 Hz
            knob.drawLine(f1000X, f1000Y, f2000X, f2000Y);
            knob.drawCircle(f2000X, f2000Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[4]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f1000X, f1000Y, f2000X, y);
                knob.drawCircle(f2000X, y, true);

                f2000Y = y;

                equalizer.param(FREQUENCIES[4], dB);
              }
            }

            // 4000 Hz
            knob.drawLine(f2000X, f2000Y, f4000X, f4000Y);
            knob.drawCircle(f4000X, f4000Y, false);

            if (context.isPointInPath(x, y)) {
              controllerCanvas.classList.add(className);
              knob.drawCross(`${FREQUENCIES[5]} Hz ${Math.trunc(dB)} dB`, x, y);

              if (isMouseDown) {
                knob.drawLine(f2000X, f2000Y, f4000X, y);
                knob.drawCircle(f4000X, y, true);

                f4000Y = y;

                equalizer.param(FREQUENCIES[5], dB);
              }
            }

            knob.drawLine(f4000X, f4000Y, controllerCanvas.width, middle);
          };

          const onMouseup = () => {
            isMouseDown = false;
          };

          knob.drawLine(0, f125Y, f125X, f125Y);
          knob.drawLine(f125X, f250Y, f250X, f250Y);
          knob.drawLine(f250X, f500Y, f500X, f500Y);
          knob.drawLine(f500X, f1000Y, f1000X, f1000Y);
          knob.drawLine(f1000X, f2000Y, f2000X, f2000Y);
          knob.drawLine(f2000X, f4000Y, f4000X, f4000Y);
          knob.drawLine(f4000X, middle, controllerCanvas.width, middle);
          knob.drawCircle(f125X, f125Y, false);
          knob.drawCircle(f250X, f250Y, false);
          knob.drawCircle(f500X, f500Y, false);
          knob.drawCircle(f1000X, f1000Y, false);
          knob.drawCircle(f2000X, f2000Y, false);
          knob.drawCircle(f4000X, f4000Y, false);

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
                  f125Y = y;
                  break;
                case 1:
                  f250Y = y;
                  break;
                case 2:
                  f500Y = y;
                  break;
                case 3:
                  f1000Y = y;
                  break;
                case 4:
                  f2000Y = y;
                  break;
                case 5:
                  f4000Y = y;
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
