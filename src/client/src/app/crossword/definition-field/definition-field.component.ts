import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DefinitionsService, Definitions, Answers } from './definitions.service';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';
import { CrosswordGridService } from '../board/crossword-grid.service';
import { SelectionService } from '../selection.service';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Definition } from './definition';

@Component({
    selector: 'app-definition-field',
    templateUrl: './definition-field.component.html',
    styleUrls: ['./definition-field.component.css']
})
export class DefinitionFieldComponent {

    public readonly HORIZONTAL = Direction.horizontal;
    public readonly VERTICAL = Direction.vertical;

    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    @Input() public cheatMode: boolean;

    private selectionSubscription: Subscription;

    constructor(private definitionService: DefinitionsService,
                private selectionService: SelectionService,
                private crosswordGridService: CrosswordGridService) {
    }

    public get definitions(): Definitions {
        return this.definitionService.definitions;
    }

    public get answers(): Answers {
        return this.definitionService.answers;
    }

    public onDefinitionClicked(index: number, direction: Direction): void {
        let selectedGridWord;
        if (direction === Direction.horizontal) {
            selectedGridWord =
                this.crosswordGridService.horizontalGridWords.get(index);
        }
        else {
            selectedGridWord =
                this.crosswordGridService.verticalGridWords.get(index);
        }
        this.selectionService.selection.next(selectedGridWord);
    }

    public onClickOutside(): void {
        this.selectionService.selection.next(SelectionService.NO_SELECTION);
    }

    public checkIfSelected(index: number, direction: Direction): boolean {
        return this.selectionService.isDefinitionSelected(
            new Definition(index, direction, '')
        );
    }

}
