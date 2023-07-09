import '/src/types';
import { GraphicEqualizer, FREQUENCIES, PRESETS } from '/src/GraphicEqualizer';
import { Knob } from '/src/Knob';

export const scriptContainer = () => {
  function main() {
    if (!window.X) {
      return;
    }

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
      window.X.setup()
        .then(() => {
          if (!window.X) {
            return;
          }

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

          const equalizer = new GraphicEqualizer(window.X.get());

          window
            .X('media')
            .setup({
              media: video,
              autoplay: true
            })
            .install('graphicequalizer', equalizer);

          // for Visualizer
          visualizerCanvas.width = window.innerWidth;
          visualizerCanvas.height = window.innerHeight;

          visualizerCanvas.setAttribute('id', visualizerCanvasId);

          document.body.appendChild(visualizerCanvas);

          const knob = new Knob(controllerCanvas, context);

          window
            .X('media')
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
          const fftSize = window.X('media').module('analyser').param('fftSize');
          const fsDivN = window.X.SAMPLE_RATE / fftSize;
          const drawnSize = window.X('media').module('analyser').domain('fft').param('size');
          const f125 = FREQUENCIES[0] / fsDivN;
          const f250 = FREQUENCIES[1] / fsDivN;
          const f500 = FREQUENCIES[2] / fsDivN;
          const f1000 = FREQUENCIES[3] / fsDivN;
          const f2000 = FREQUENCIES[4] / fsDivN;
          const f4000 = FREQUENCIES[5] / fsDivN;
          // const f8000       = FREQUENCIES[6] / fsDivN;
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
            const { innerWidth: width, innerHeight: height } = window;

            visualizerCanvas.width = width;
            visualizerCanvas.height = height;

            controllerCanvas.width = width;
            controllerCanvas.height = height;

            window.removeEventListener('resize', onResize, false);
          };

          window.addEventListener('resize', onResize, false);

          select.setAttribute('id', selectPresetId);

          const fragment = document.createDocumentFragment();

          Object.keys(PRESETS).forEach((presetName: string) => {
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
        .catch((error: Error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  }

  main();
};
