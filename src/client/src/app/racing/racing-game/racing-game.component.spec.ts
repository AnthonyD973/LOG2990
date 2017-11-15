import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RacingGameComponent } from './racing-game.component';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { RacingGameService } from './racing-game.service';
import { MapService } from '../services/map.service';
import { UIInputs } from '../services/ui-input.service';
import { EventManager } from '../../event-manager.service';
import { PhysicEngine } from './physic/engine';

describe('RacingGameComponent', () => {
    let component: RacingGameComponent;
    let fixture: ComponentFixture<RacingGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([{ path: 'racing/racing-game/:map-name', component: RacingGameComponent}]),
                HttpModule,
                NoopAnimationsModule
            ],
            declarations: [RacingGameComponent, UIInputs],
            providers: [
                {provide: APP_BASE_HREF, useValue: '/'},
                RacingGameService,
                MapService,
                EventManager,
                PhysicEngine
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RacingGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
