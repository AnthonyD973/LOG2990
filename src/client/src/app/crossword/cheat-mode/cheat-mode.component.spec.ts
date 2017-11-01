import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheatModeComponent } from './cheat-mode.component';
import { CrosswordGameService } from '../crossword-game.service';

describe('CheatModeComponent', () => {
    let component: CheatModeComponent;
    let fixture: ComponentFixture<CheatModeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CheatModeComponent
            ],
            providers: [
                CrosswordGameService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CheatModeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});