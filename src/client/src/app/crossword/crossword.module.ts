import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { CrosswordComponent } from './crossword.component';
import { BoardComponent } from './board/board.component';
import { DefinitionFieldComponent } from './definition-field/definition-field.component';
import { ConfigMenuComponent } from './config-menu/config-menu.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { FormsModule } from '@angular/forms';
import { ConfigMenuService } from './config-menu/config-menu.service';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { CrosswordGameService } from './crossword-game.service';
import { CrosswordTileComponent } from './board/crossword-tile/crossword-tile.component';
import { CrosswordGridService } from './board/crossword-grid.service';
import { GameDetailsService } from './game-details/game-details.service';
import { SelectionService } from './selection.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ClickOutsideModule,
        RouterModule
    ],
    declarations: [
        CrosswordComponent,
        BoardComponent,
        DefinitionFieldComponent,
        ConfigMenuComponent,
        GameDetailsComponent,
        CrosswordTileComponent,
    ],
    providers: [
        HttpClient,
        ConfigMenuService,
        SimpleTimer,
        DefinitionsService,
        CrosswordGameService,
        CrosswordGridService,
        GameDetailsService,
        SelectionService
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule { }


