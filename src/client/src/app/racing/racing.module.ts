import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RacingComponent } from './components/racing/racing.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        RacingComponent
    ],
    declarations: [
        RacingComponent
    ]
})
export class RacingModule { }
