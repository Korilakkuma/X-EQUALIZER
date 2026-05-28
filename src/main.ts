import { X } from 'xsound';
import { GraphicEqualizer } from './GraphicEqualizer';
import { Knob } from './Knob';
import { FREQUENCIES, PRESETS, isPresetName } from './config';

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

        const widthOfRect = window.innerWidth / (FREQUENCIES.length + 1);

        const f32X = Math.trunc(1 * widthOfRect);
        const f62X = Math.trunc(2 * widthOfRect);
        const f125X = Math.trunc(3 * widthOfRect);
        const f250X = Math.trunc(4 * widthOfRect);
        const f500X = Math.trunc(5 * widthOfRect);
        const f1000X = Math.trunc(6 * widthOfRect);
        const f2000X = Math.trunc(7 * widthOfRect);
        const f4000X = Math.trunc(8 * widthOfRect);
        const f8000X = Math.trunc(9 * widthOfRect);
        const f16000X = Math.trunc(10 * widthOfRect);

        let f32Y = middle;
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

        const onMousemove = (event: MouseEvent) => {
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
          // 32 Hz
          knob.drawLine(0, middle, f32X, f32Y);
          knob.drawCircle(f32X, f32Y, false);

          if (context.isPointInPath(x, y)) {
            controllerCanvas.classList.add(className);
            knob.drawCross(`${FREQUENCIES[0]} Hz ${Math.trunc(dB)} dB`, x, y);

            if (isMouseDown) {
              knob.drawLine(0, middle, f32X, y);
              knob.drawCircle(f32X, y, true);

              f32Y = y;

              equalizer.param(FREQUENCIES[1], 2 * dB);
            }
          }

          // 62.5 Hz
          knob.drawLine(f32X, f32Y, f62X, f62Y);
          knob.drawCircle(f62X, f62Y, false);

          if (context.isPointInPath(x, y)) {
            controllerCanvas.classList.add(className);
            knob.drawCross(`${FREQUENCIES[1]} Hz ${Math.trunc(dB)} dB`, x, y);

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
            knob.drawCross(`${FREQUENCIES[2]} Hz ${Math.trunc(dB)} dB`, x, y);

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
            knob.drawCross(`${FREQUENCIES[3]} Hz ${Math.trunc(dB)} dB`, x, y);

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
            knob.drawCross(`${FREQUENCIES[4]} Hz ${Math.trunc(dB)} dB`, x, y);

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
            knob.drawCross(`${FREQUENCIES[5]} Hz ${Math.trunc(dB)} dB`, x, y);

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
            knob.drawCross(`${FREQUENCIES[6]} Hz ${Math.trunc(dB)} dB`, x, y);

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
            knob.drawCross(`${FREQUENCIES[7]} Hz ${Math.trunc(dB)} dB`, x, y);

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
            knob.drawCross(`${FREQUENCIES[8]} Hz ${Math.trunc(dB)} dB`, x, y);

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
            knob.drawCross(`${FREQUENCIES[9]} Hz ${Math.trunc(dB)} dB`, x, y);

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

        knob.drawLine(0, f32Y, f62X, f62Y);
        knob.drawLine(f62X, f62Y, f125X, f125Y);
        knob.drawLine(f125X, f125Y, f250X, f250Y);
        knob.drawLine(f250X, f250Y, f500X, f500Y);
        knob.drawLine(f500X, f500Y, f1000X, f1000Y);
        knob.drawLine(f1000X, f1000Y, f2000X, f2000Y);
        knob.drawLine(f2000X, f2000Y, f4000X, f4000Y);
        knob.drawLine(f4000X, f4000Y, f8000X, f8000Y);
        knob.drawLine(f16000X, middle, window.innerWidth, middle);

        knob.drawCircle(f32X, f32Y, false);
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

        const onChangePreset = (event: Event) => {
          if (!(event.currentTarget instanceof HTMLSelectElement)) {
            return;
          }

          const presetName = event.currentTarget.value;

          if (!isPresetName(presetName)) {
            return;
          }

          const presetValues = PRESETS[presetName];

          for (let i = 0, len = presetValues.length; i < len; i++) {
            equalizer.param(FREQUENCIES[i], presetValues[i]);

            const maxdB = 18;
            const y = 0 - (presetValues[i] / maxdB) * middle + middle;

            switch (i) {
              case 0:
                f32Y = y;
                break;
              case 1:
                f62Y = y;
                break;
              case 2:
                f125Y = y;
                break;
              case 3:
                f250Y = y;
                break;
              case 4:
                f500Y = y;
                break;
              case 5:
                f1000Y = y;
                break;
              case 6:
                f2000Y = y;
                break;
              case 7:
                f4000Y = y;
                break;
              case 8:
                f8000Y = y;
                break;
              case 9:
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
