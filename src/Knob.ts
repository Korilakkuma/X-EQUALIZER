export class Knob {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  public drawCircle(x: number, y: number, isMouseDown: boolean): void {
    const radius = isMouseDown ? 24 : 12;

    this.context.fillStyle = '#fdfdfd';
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
    this.context.fill();
  }

  public drawLine(startX: number, startY: number, endX: number, endY: number): void {
    this.context.lineWidth = 1;
    this.context.strokeStyle = '#fdfdfd';
    this.context.beginPath();
    this.context.moveTo(startX, startY);
    this.context.lineTo(endX, endY);
    this.context.stroke();
  }

  public drawCross(text: string, x: number, y: number): void {
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
