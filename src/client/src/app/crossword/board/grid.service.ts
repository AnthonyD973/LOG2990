import { Injectable } from '@angular/core';

import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { mockHorizontalGridWords, mockVerticalGridWords } from '../mocks/grid-mock';
import { PacketManagerClient } from '../../packet-manager-client';
import { registerHandlers, PacketHandler, PacketEvent } from '../../../../../common/src/index';
import { WordTryPacket } from '../../../../../common/src/crossword/packets/word-try.packet';
import '../../../../../common/src/crossword/packets/word-try.parser';
import { GridWordPacket } from '../../../../../common/src/crossword/packets/grid-word.packet';
import '../../../../../common/src/crossword/packets/grid-word.parser';
import { ClearGridPacket } from '../../../../../common/src/crossword/packets/clear-grid.packet';
import '../../../../../common/src/crossword/packets/clear-grid.parser';
import { Grid } from './grid';
import { SelectionService } from '../selection.service';
import { GameService, GameState } from '../game.service';
import { WordByIdAndDirection } from './selected-grid-word';

@Injectable()
export class GridService {

    private readonly GRID = new Grid();
    private callbacks: (() => void)[] = [];

    constructor(private packetManager: PacketManagerClient,
                private selectionService: SelectionService,
                private gameService: GameService) {
        registerHandlers(this, packetManager);

        // This mock is meant to stay as an initial view
        mockHorizontalGridWords().forEach((word) => {
            this.GRID.addWord(word);
        });
        mockVerticalGridWords().forEach((word) => {
            this.GRID.addWord(word);
        });
    }

    public get words(): GridWord[] {
        return this.GRID.words;
    }

    public getCharAt(row: number, column: number): string {
        return this.GRID.getCharAt(row, column);
    }

    public getWord(wordSearch: WordByIdAndDirection): GridWord {
        if (wordSearch.id !== SelectionService.NO_SELECTION.id) {
            return this.GRID.getWord(wordSearch.id, wordSearch.direction);
        }
        else {
            return null;
        }
    }

    public setUserInput(word: GridWord): void {
        this.GRID.userInput = word;
        if (word.length === word.string.length) {
            this.sendWordToServer(word);
        }
    }

    public addOnChangeCallback(callback: () => void): void {
        this.callbacks.push(callback);
    }

    public checkIfWordIsFound(wordId: number, wordDirection: Direction): boolean {
        return this.GRID.getWord(wordId, wordDirection).owner !== Owner.none;
    }

    private sendWordToServer(word: GridWord): void {
        this.packetManager.sendPacket(WordTryPacket, new WordTryPacket(word));
    }

    private onChange(): void {
        this.callbacks.forEach((callback) => callback());
    }

    @PacketHandler(GridWordPacket)
    // tslint:disable-next-line:no-unused-variable
    private updateGridWord(event: PacketEvent<GridWordPacket>): void {
        this.GRID.addWord(event.value.gridword);
        this.onChange();
    }

    @PacketHandler(ClearGridPacket)
    // tslint:disable-next-line:no-unused-variable
    private clearGrid(): void {
        this.GRID.empty();
        this.onChange();
    }

    @PacketHandler(WordTryPacket)
    // tslint:disable-next-line:no-unused-variable
    private wordWasFound(event: PacketEvent<WordTryPacket>): void {
        const word = event.value.wordTry;
        this.GRID.updateWord(word);
        const isWordSelected =
            this.selectionService.selectionValue.player !== SelectionService.NO_SELECTION &&
            this.selectionService.selectionValue.player.id === word.id &&
            this.selectionService.selectionValue.player.direction === word.direction;
        if (isWordSelected) {
            this.selectionService.updateSelectedGridWord(SelectionService.NO_SELECTION);
        }
        if (this.getPlayerWordsFoundCount() + this.getOpponentWordsFoundCount() >= this.GRID.numberOfWords) {
            this.gameService.state = GameState.finished;
            this.gameService.finishGame(
                this.getPlayerWordsFoundCount(),
                this.getOpponentWordsFoundCount()
            );
        }
        this.onChange();
    }

    public getPlayerWordsFoundCount() {
        return this.GRID.getPlayerWordsFoundCount();
    }

    public getOpponentWordsFoundCount() {
        return this.GRID.getOpponentWordsFoundCount();
    }

}