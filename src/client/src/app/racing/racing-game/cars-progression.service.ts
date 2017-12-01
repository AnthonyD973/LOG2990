import { Injectable } from '@angular/core';
import { EventManager } from '../../event-manager.service';
import { AFTER_PHYSIC_UPDATE_EVENT } from './physic/engine';
import { Seconds } from '../../types';
import { CarController } from './physic/ai/car-controller';
import { Car } from './models/car/car';
import { Line } from '../../../../../common/src/math/line';
import { LapProgression } from './racing-types';
import { Projection } from '../../util/projection';
import { MapPositionAlgorithms } from '../../util/map-position-algorithms';
import { Point } from '../../../../../common/src/math/point';
import { UserCarController } from './physic/ai/user-car-controller';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';


@Injectable()
/**
 * Keeps Track of the cars progression relative to the map
 * (On a linear scale)
 */
export class CarsProgressionService {

    public carsLapProgression: Map<Car, number> = new Map();
    public carsLapNumber: Map<Car, number> = new Map();

    public get userLapsCount(): number {
        return this.carsLapNumber.get(this.userCar);
    }

    public get userLapProgressionInPercent(): number {
        return Math.floor((this.carsLapProgression.get(this.userCar) % 1) * 100);
    }

    private carsHalfMark: Map<Car, boolean> = new Map();

    private controllers: CarController[] = [];
    private userCar: Car;
    private mapLines: Line[];
    private mapLength: number;
    private progressionUpdateCounter = 0;

    public constructor(private eventManager: EventManager) {
        eventManager.registerClass(this);
    }

    public initialize(controllers: CarController[], mapLines: Line[]): void {
        this.mapLength = mapLines.map((line) => line.length).reduce((sum, val) => sum + val);
        this.mapLines = mapLines;
        this.controllers = controllers;
        for (const controller of controllers) {
            this.carsLapProgression.set(controller.car, 0);
            this.carsLapNumber.set(controller.car, 1);
            this.carsHalfMark.set(controller.car, false);
            if (controller instanceof UserCarController) {
                this.userCar = controller.car;
            }
        }
    }

    public computeUserRank(): number {
        return 1;
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    private updateCarsProgression(event: EventManager.Event<{ deltaTime: Seconds }>): void {
        if (++this.progressionUpdateCounter === 30) {
            this.progressionUpdateCounter = 0;
            for (const controller of this.controllers) {
                const newLapProgression: number = this.computeLapProgression(controller.car);
                if (newLapProgression > 0.45 && newLapProgression < 0.55) {
                    this.carsHalfMark.set(controller.car, true);
                }
                else if (newLapProgression < 0.5 && this.carsHalfMark.get(controller.car)) {
                    this.carsHalfMark.set(controller.car, false);
                    this.carsLapNumber.set(controller.car, this.carsLapNumber.get(controller.car) + 1);
                }
                this.carsLapProgression.set(controller.car, this.computeLapProgression(controller.car));
            }
        }
    }

    private computeCurrentLap(car: Car): number {
        return 0;
    }

    private computeLapProgression(car: Car): LapProgression {
        let progression: LapProgression = 0;
        const projection: Projection = MapPositionAlgorithms.getClosestProjection(
            new Point(car.position.x, car.position.z), this.mapLines);

        const currentSegment: number = this.mapLines.indexOf(projection.segment);

        // Add completed segments
        for (let i = 0; i < currentSegment; ++i) {
            progression += this.mapLines[i].length;
        }

        // Add fraction of current segment
        progression += this.mapLines[currentSegment].length * projection.interpolation;

        // Divide by map length to get a [0,1) value
        progression /= this.mapLength;

        return progression;
    }

    private toFixedLength(n: number): number {
        return Math.floor(n * 100);
    }
}
