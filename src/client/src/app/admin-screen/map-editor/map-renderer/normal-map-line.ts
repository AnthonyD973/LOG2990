import { AbstractMapLine } from './abstract-map-line';
import { Point } from '../point';
import { NormalMapLineColors } from './normal-map-line-colors';

const WIDTH = 5;

export class NormalMapLine extends AbstractMapLine {

    constructor(context: CanvasRenderingContext2D,
                origin: Point,
                destination: Point) {
        super(context, origin, destination, new NormalMapLineColors(), WIDTH);
    }

}