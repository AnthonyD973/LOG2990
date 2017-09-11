import { Drawable } from './drawable';

export class Point implements Drawable {
    private context: CanvasRenderingContext2D;
    public x: number;
    public y: number;
    public radius: number;
    public color: string;

    constructor(context: CanvasRenderingContext2D, x: number = 0, y: number = 0, radius: number = 10, color: string = 'blue') {
        this.context = context;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    public draw(): void {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = this.color;
        this.context.fill();
    }

    public isMouseOver(x: number, y: number): boolean {
        const DISTANCE_SQUARED: number = (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y);
        const RADIUS_SQUARED: number = this.radius * this.radius;

        return (DISTANCE_SQUARED < RADIUS_SQUARED);
    }
}
