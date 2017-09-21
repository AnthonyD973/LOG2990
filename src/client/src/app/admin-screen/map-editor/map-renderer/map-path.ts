import { Drawable } from './drawable';
import { Point } from '../point';
import { AbstractMapPoint } from './abstract-map-point';
import { NormalMapPoint } from './normal-map-point';
import { FirstMapPoint } from './first-map-point';
import { AbstractMapLine } from './abstract-map-line';
import { NormalMapLine } from './normal-map-line';
import { Map } from '../map';
import { Line } from '../line';
import { Path } from '../path';
import { FaultyMapLine } from './faulty-map-line';

export class MapPath implements Drawable {

    private context: CanvasRenderingContext2D;
    private points: AbstractMapPoint[] = [];
    private lines: AbstractMapLine[] = [];

    constructor(context: CanvasRenderingContext2D, points: Point[]) {
        this.context = context;
        this.updatePoints(points);
    }

    public updatePoints(points: Point[]): void {
        this.generatePointsFrom(points);
        this.generateLinesFrom(points);
    }

    private generatePointsFrom(points: Point[]): void {
        this.points = points.map((point: Point, index: number) => {
            if (index !== 0) {
                return new NormalMapPoint(this.context, point.x, point.y);
            }
            else { // I prefer a good ol' if-else, even though the else is not
                   // necessary.
                return new FirstMapPoint(this.context, point.x, point.y);
            }
        });
    }

    private generateLinesFrom(points: Point[]): void {
        const MAP: Map = new Map();
        const LINES: AbstractMapLine[] = [];
        this.lines = [];

        if (this.points.length < 2) {
            return;
        }

        let erroneousLines: [Line, Line][] = [];

        MAP.path.points.push.apply(MAP.path.points, points);
        erroneousLines = MAP.computeCrossingLines();

        this.lines = points.map((point: Point, index: number): AbstractMapLine => {
            if (index < points.length - 1) {
                return new NormalMapLine (this.context, point, points[index + 1]);
            }
        }).filter((value) => value !== undefined);

        this.lines.forEach((line: NormalMapLine, index: number) => {
            const isBadLinePredicate = (badLines: [Line, Line]) => {
                return (line.origin.equals(badLines[0].origin) &&
                       line.destination.equals(badLines[0].destination)) ||
                       (line.origin.equals(badLines[1].origin) &&
                       line.destination.equals(badLines[1].destination));
            };
            if (erroneousLines.findIndex(isBadLinePredicate) >= 0) {
                this.lines[index] = new FaultyMapLine(this.context, line.origin, line.destination);
            }
        });
    }

    public draw(): void {
        this.drawLines();
        this.drawPoints();
    }

    private drawLines(): void {
        this.lines.forEach((line) => {
            line.draw();
        });
    }

    private drawPoints(): void {
        this.points.forEach((point: AbstractMapPoint) => {
            point.draw();
        });
    }

}
