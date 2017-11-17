import { expect } from 'chai';
import { Grid } from './grid';
import { Word } from './word';
import { WordPosition } from './word-position';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';

describe('Grid', () => {

    it('should be created', () => {
        const GRID = new Grid();
        expect(GRID).to.be.ok;
    });

    describe('doesWordAlreadyExist', () => {

        const MAKE_TEST_GRIDS = () => {
            const ACROSS_WORDS = [
                new Word('one',    new WordPosition(0, 0)),
                new Word('two',    new WordPosition(2, 6)),
                new Word('across', new WordPosition(4, 4))
            ];
            const VERTICAL_WORDS = [
                new Word('one',  new WordPosition(1, 0)),
                new Word('two',  new WordPosition(6, 3)),
                new Word('vert', new WordPosition(6, 8))
            ];

            const GRID_ACROSS = new Grid();
            const GRID_VERTICAL = new Grid();
            const GRID_BOTH = new Grid();

            GRID_ACROSS.across = ACROSS_WORDS;
            GRID_VERTICAL.vertical = VERTICAL_WORDS;
            GRID_BOTH.across = ACROSS_WORDS;
            GRID_BOTH.vertical = VERTICAL_WORDS;

            const GRIDS = [
                GRID_ACROSS,
                GRID_VERTICAL,
                GRID_BOTH
            ];

            return GRIDS;
        };

        it('should tell that a word already exists if it does', () => {
            const GRIDS = MAKE_TEST_GRIDS();
            GRIDS.forEach(grid => {
                expect(grid.doesWordAlreadyExist('one')).to.be.true;
                expect(grid.doesWordAlreadyExist('two')).to.be.true;
            });
        });

        it('should tell that a word does not exist if it does not', () => {
            const GRIDS = MAKE_TEST_GRIDS();
            GRIDS.forEach(grid => {
                expect(grid.doesWordAlreadyExist('hi')).to.be.false;
                expect(grid.doesWordAlreadyExist('there')).to.be.false;
            });
        });

    });

    it('should convert itself to an array of GridWords', () => {
        const grid = new Grid();

        const ACROSS = [
            new Word('hi',  new WordPosition(0, 0)),
            new Word('there', new WordPosition(5, 2))
        ];
        const VERTICAL = [
            new Word('signed', new WordPosition(2, 0)),
            new Word('chucknorris', new WordPosition(3, 2))
        ];
        const EXPECTED_RESULT = [
            new GridWord(0, 0, 0, 2,  Direction.horizontal, Owner.none, 'hi'),
            new GridWord(1, 5, 2, 5,  Direction.horizontal, Owner.none, 'there'),
            new GridWord(2, 2, 0, 6,  Direction.vertical,   Owner.none, 'signed'),
            new GridWord(3, 3, 2, 11, Direction.vertical,   Owner.none, 'chucknorris')
        ];

        grid.across = ACROSS;
        grid.vertical = VERTICAL;

        grid.toGridWords().forEach(gridWord => {
            const predicate = (expectedWord: GridWord) =>
                expectedWord.length === gridWord.length &&
                expectedWord.direction === gridWord.direction &&
                expectedWord.owner === gridWord.owner &&
                expectedWord.string === gridWord.string &&
                expectedWord.x === gridWord.x &&
                expectedWord.y === gridWord.y;
            const isWordFound = EXPECTED_RESULT.findIndex(predicate) >= 0;
            expect(isWordFound).to.be.true;
        });

    });

});
