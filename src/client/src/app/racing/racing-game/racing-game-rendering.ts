import { Skybox } from './skybox';
import * as THREE from 'three';
import { ElementRef } from '@angular/core';

export class RacingGameRendering {

    public readonly WIDTH: number = window.innerWidth;
    public readonly HEIGHT: number = window.innerHeight;

    public readonly VIEW_ANGLE: number = 75;
    public readonly ASPECT: number = this.WIDTH / this.HEIGHT;

    public readonly NEAR: number = 1;
    public readonly FAR: number = 1000000;

    public SCENE: THREE.Scene;
    public CAMERA: THREE.PerspectiveCamera;
    public RENDERER: THREE.WebGLRenderer;
    private readonly SKYBOX: Skybox;
    private readonly LIGHTS: THREE.Light[] = [];

    constructor(canvas: ElementRef) {
        this.SCENE = new THREE.Scene();
        this.RENDERER = new THREE.WebGLRenderer({canvas: canvas.nativeElement});
        this.CAMERA = new THREE.PerspectiveCamera(
            this.VIEW_ANGLE,
            this.ASPECT,
            this.NEAR,
            this.FAR);
        this.SKYBOX = new Skybox('Day');

        this.SCENE.add(this.SKYBOX);
        this.SCENE.add(this.CAMERA);
    }

    public setupScene(): void {

        this.setupCamera();

    }

    private setupCamera(): void {
        this.CAMERA.position.set(0, 500, 1000);
        this.CAMERA.lookAt(this.SCENE.position);
    }

}
