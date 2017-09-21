import { expect } from 'chai';
import { Grid, Word } from './grid-generator';

const puzzle = new Grid(10);
describe('#Grid', () => {
    it('Object Grid is generated', () => {
        expect(puzzle).is.not.undefined;
    });
});

describe('#Grid is squared and 10x10', () => {
    it('Grid is length 10', () => {
        expect(puzzle.grid.length).to.be.equal(10);
    });

    it('Grid is length 10 for each row', () => {
        for (let i = 0; i < puzzle.grid.length; i ++) {
            expect(puzzle.grid[i].length).to.be.equal(10);
        }
    });
});


describe('#Each column contains 1 or 2 words', () => {
    it('Each row contains 1 or 2 words', () => {
        let oneWordPerRow = true;
        for (let i = 1; i < puzzle.gridForAcross.length; i++) {
            if (puzzle.gridForAcross[i][0] === puzzle.gridForAcross[i - 1][0]) {
                oneWordPerRow = false;
            }
        }
        expect(oneWordPerRow === true);
    });
    it('Each columns contains 1 or 2 words', () => {
        let oneWordPerColumn = true;
        for (let i = 1; i < puzzle.gridForVertical.length; i++) {
            if (puzzle.gridForVertical[i][0] === puzzle.gridForVertical[i - 1][0]) {
                oneWordPerColumn = false;
            }
        }
        expect(oneWordPerColumn === true);
    });
});


describe('#Grid-generator put words on the right position', () => {

    const crossword = new Grid(10);
    beforeEach(() => {
        crossword.gridForAcross = [];
        crossword.gridForVertical = [];
    });

    it('Putting a word vertically at 0', () => {
        const test = new Word('test');
        crossword.putWordVertical(test, 0);
        expect(test.position = [0, 0]);
    });

    it('Putting a word vertically at 4', () => {
        const test = new Word('test');
        crossword.putWordVertical(test, 4);
        expect(test.position = [4, 4]);
    });

    it('Putting a word vertically at 9', () => {
        const test = new Word('test');
        crossword.putWordVertical(test, 9);
        expect(test.position = [2, 9]);
    });

    it('Putting a word horizontally at 0', () => {
        const test = new Word('test');
        crossword.putWordAcross(test, 0);
        expect(test.position = [0, 0]);
    });

    it('Putting a word horizontally at 4', () => {
        const test = new Word('test');
        crossword.putWordAcross(test, 4);
        expect(test.position = [4, 4]);
    });

    it('Putting a word horizontally at 9', () => {
        const test = new Word('test');
        crossword.putWordAcross(test, 9);
        expect(test.position = [2, 9]);
    });

});

describe('#Return random word from suggestions case one', () => {

    const crossword = new Grid(10);
    beforeEach(() => {
        crossword.gridForAcross = [];
        crossword.gridForVertical = [];
    });

    it ('Return a word of length between 9 and 3 in first row', () => {
        const word = crossword.returnARandomWordFromSuggestionsCaseOne('a', 0);
        expect(word.length <= 9 && word.length >= 3);
    });
    it ('Return a word of length between 4 and 3 in second row', () => {
        const word = crossword.returnARandomWordFromSuggestionsCaseOne('a', 1);
        expect(word.length <= 4 && word.length >= 3);
    });
    it ('Return a word of a length 3 in the third row', () => {
        const word = crossword.returnARandomWordFromSuggestionsCaseOne('a', 2);
        expect(word.length === 3);
    });
    it ('Return a word of undefined', () => {
        const word = crossword.returnARandomWordFromSuggestionsCaseOne('cc', 0);
        expect(word === 'nothing found');
    });
});

describe('#Return random word from suggestions case two', () => {

        const crossword = new Grid(10);
        beforeEach(() => {
            crossword.gridForAcross = [];
            crossword.gridForVertical = [];
        });

        it ('Return a word of length between 5 and 3 in first row', () => {
            const word = crossword.returnARandomWordFromSuggestionsCaseTwo('a', 0);
            expect(word.length <= 5 && word.length >= 3);
        });
        it ('Return a word of length 3 second row', () => {
            const word = crossword.returnARandomWordFromSuggestionsCaseTwo('a', 1);
            expect(word.length === 3);
        });
        it ('Return a word of a length 5 in the third row', () => {
            const word = crossword.returnARandomWordFromSuggestionsCaseTwo('a', 2);
            expect(word.length === 5);
        });
        it ('Return a word of length 3 fourth row', () => {
            const word = crossword.returnARandomWordFromSuggestionsCaseTwo('a', 3);
            expect(word.length === 3);
        });
        it ('Return a word of undefined', () => {
            const word = crossword.returnARandomWordFromSuggestionsCaseTwo('cc', 0);
            expect(word === 'nothing found');
        });
    });

describe('#Return random word from suggestions case three', () => {

        const crossword = new Grid(10);
        beforeEach(() => {
            crossword.gridForAcross = [];
            crossword.gridForVertical = [];
        });

        it ('Return a word of length between 3 in first row', () => {
            const word = crossword.returnARandomWordFromSuggestionsCaseTwo('a', 0);
            expect(word.length === 3);
        });
        it ('Return a word of length between 5 and 3 in second row', () => {
            const word = crossword.returnARandomWordFromSuggestionsCaseTwo('a', 1);
            expect(word.length <= 5 && word.length >= 3);
        });
        it ('Return a word of a length between 8 and 3 in third row', () => {
            const word = crossword.returnARandomWordFromSuggestionsCaseTwo('a', 2);
            expect(word.length <= 8 && word.length >= 3);
        });
        it ('Return a word of undefined', () => {
            const word = crossword.returnARandomWordFromSuggestionsCaseTwo('cc', 0);
            expect(word === 'nothing found');
        });
    });

describe('Get the right word of desired lenght', () => {
    it ('get word of length between 1 and 3', () => {
        const word = puzzle.getWordOfDesiredLength(1, 3);
        expect(word.value.length <= 3 && word.value.length >= 1);
    });
    it ('get word of length between 4 and 6', () => {
        const word = puzzle.getWordOfDesiredLength(4, 6);
        expect(word.value.length <= 6 && word.value.length >= 4);

    });
    it ('get word of length between 7 and 10', () => {
        const word = puzzle.getWordOfDesiredLength(7, 10);
        expect(word.value.length <= 7 && word.value.length >= 10);

    });

    it ('get word with no accent, apostrophe and dash', () => {
        const word = "éÏû-t'";
        const correctedWord = puzzle.wordFormatting(word);
        expect(correctedWord === 'eIut');
    });

    it ('word is already in the grid case 1', ()  => {
        const crossword = new Grid(10);
        crossword.gridForAcross = [];
        crossword.gridForVertical = [];
        crossword.gridForAcross.push(new Word('test'));
        const verification = crossword.alreadyChoosen('test');
        expect(verification === true);
    });
    it ('word is already in the grid case 2', ()  => {
        const crossword = new Grid(10);
        crossword.gridForAcross = [];
        crossword.gridForVertical = [];
        crossword.gridForVertical.push(new Word('test'));
        const verification = crossword.alreadyChoosen('test');
        expect(verification === true);
    });
    it ('word is not in the grid', () => {
        const crossword = new Grid(10);
        crossword.gridForAcross = [];
        crossword.gridForVertical = [];
        crossword.gridForAcross.push(new Word('test1'));
        crossword.gridForVertical.push(new Word('test2'));
        const verification = crossword.alreadyChoosen('test');
        expect(verification === false);
    });

    });


