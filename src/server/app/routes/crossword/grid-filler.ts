import { Word } from './word';
import { getWordOfDesiredLength, getRandomIndex } from './lexique';
import { Grid } from './grid-generator';
import { lexicon } from './englishWords';


export const WORD_SEARCH_MAX_ATTEMPT = 25;
export enum column { first, second, third }
export enum row { first, second, third }

export abstract class GridFiller {

    protected acrossWordLenght: [number, number][];

    protected firstWordLenght: [number, number];
    protected secondWordLenght: [number, number];
    protected thirdWordLenght: [number, number];
    protected untilWhichRow: number;


    public temporaryGridForAcross: Word[] = [];
    public temporaryGridForVertical: Word[] = [];

    constructor(grid: Grid) { }

    public pushOnTheTemporaryGridAcrossWordsSuggestions(wordsSuggestions: string[]) {
        for (let i = 0; i < wordsSuggestions.length; i++) {
            this.temporaryGridForAcross.push(new Word(wordsSuggestions[i]));
        }
    }

    public initialisation(grid: Grid) {
        const word = getWordOfDesiredLength(this.firstWordLenght[0], this.firstWordLenght[1], grid);

        this.temporaryGridForVertical.push(word);
        this.findSecondWord(word, grid);
    }

    public findSecondWord(word: Word, grid: Grid) {
        let firstWordsSuggestions: string[] = [];
        let maxAttempt = WORD_SEARCH_MAX_ATTEMPT;
        while (maxAttempt !== 0) {
            word = getWordOfDesiredLength(this.secondWordLenght[0], this.secondWordLenght[1], grid);
            this.temporaryGridForVertical.push(word);
            firstWordsSuggestions = this.returnArrayOfWordsThatFitsAcross(column.second);

            if (this.suggestionsContainsNothing(firstWordsSuggestions)) {
                this.temporaryGridForVertical.pop();
                maxAttempt--;
            } else {
                break;
            }
        }
        if (maxAttempt === 0) {
            this.temporaryGridForVertical.pop();
            this.initialisation(grid);
        } else {
            this.findThirdWord(word, firstWordsSuggestions, grid);
        }
    }

    public findThirdWord(word: Word, wordsSuggestions: string[], grid: Grid) {
        wordsSuggestions = [];
        let maxAttempt = WORD_SEARCH_MAX_ATTEMPT;
        while (maxAttempt !== 0) {
            word = getWordOfDesiredLength(this.thirdWordLenght[0], this.thirdWordLenght[1], grid);

            this.temporaryGridForVertical.push(word);
            wordsSuggestions = this.returnArrayOfWordsThatFitsAcross(column.third);

            if (this.suggestionsContainsNothing(wordsSuggestions)) {
                this.temporaryGridForVertical.pop();
                maxAttempt--;
            } else {
                break;
            }
        }
        if (maxAttempt === 0) {
            this.temporaryGridForVertical.pop();
            this.findSecondWord(word, grid);
        } else {
            this.pushOnTheTemporaryGridAcrossWordsSuggestions(wordsSuggestions);
        }
    }

    public returnArrayOfWordsThatFitsAcross(onColumnNow: number) {
        const firstLettersWordsArray: string[] = [];
        let beginningOfTheWordOnAcross: string[] = [];

        for (let row = 0; row < this.untilWhichRow; row++) { // for the first rows of the grid
            for (let column = 0; column <= onColumnNow; column++) {
                beginningOfTheWordOnAcross.push(this.temporaryGridForVertical[column].value[row]);
            }
            const beginningOfTheWordOnAcrossString: string = beginningOfTheWordOnAcross.join('');
            beginningOfTheWordOnAcross = [];
            let returnedWord;

            returnedWord = this.returnARandomWordFromSuggestions(beginningOfTheWordOnAcrossString, row);
            firstLettersWordsArray.push(returnedWord);
        }

        return firstLettersWordsArray;
    }

    public suggestionsContainsNothing(arrayOfSuggestions: string[]) {
        for (let i = 0; i < arrayOfSuggestions.length; i++) {
            if (arrayOfSuggestions[i] === 'nothing found') {
                return true;
            }
        }
        return false;
    }

    protected getSuggestion(theWords: string[], rowNumber: number, wordIndex: number) {
        if (lexicon[wordIndex].length <= this.acrossWordLenght[rowNumber][1] &&
            lexicon[wordIndex].length >= this.acrossWordLenght[rowNumber][0]) {
            theWords.push(lexicon[wordIndex]);
        }
    }

    public returnARandomWordFromSuggestions(beginningOfTheWordAcross: string, rowNumber: number): string {
        let returnedWord;
        const theWords: string[] = [];
        for (let i = 0; i < lexicon.length; i++) {  // if the beginning of 2 words matches
            if (lexicon[i].substring(0, beginningOfTheWordAcross.length) === beginningOfTheWordAcross) {
                if (beginningOfTheWordAcross.length > 0) {
                    this.getSuggestion(theWords, rowNumber, i);
                }
            }
        }

        returnedWord = theWords[getRandomIndex(0, theWords.length - 1)];

        if (!returnedWord) {
            returnedWord = 'nothing found';
        }
        return returnedWord;
    }
}

