import { expect } from 'chai';
import { GridFillerFourthSection } from './grid-filler-fourth-section';
import { Grid } from './grid';
import { DifficultyEasy } from './difficulty-easy';
import { NormalWordSuggestionsGetter } from './normal-word-suggestions-getter';

describe('GridFillerFourthSection', () => {

    let filler: GridFillerFourthSection;

    beforeEach(() => {
        filler = new GridFillerFourthSection(
            new NormalWordSuggestionsGetter(new DifficultyEasy()));
    });

    it('should be created', () => {
        expect(filler).to.be.ok;
    });

    it('should fill grids', () => {
        const GRID = new Grid();
        filler.fill(GRID);
        filler.acrossPlacement.forEach((placement) => {
            const MATCH_INDEX = GRID.across.findIndex((acrossWord) => {
                const WORD_LENGTH_MATCHES =
                    acrossWord.value.length >= placement.minLength &&
                    acrossWord.value.length <= placement.maxLength;
                const PLACEMENT_MATCHES = placement.position.equals(acrossWord.position);
                return WORD_LENGTH_MATCHES && PLACEMENT_MATCHES;
            });
            expect(MATCH_INDEX).to.be.gte(0, 'Placement requirement not met');
        });
    });

});
