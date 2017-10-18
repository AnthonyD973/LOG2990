import { GridFiller } from './grid-filler';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from './word-position';
import { AbstractWordSuggestionsGetter } from './abstract-word-suggestions-getter';

export class GridFillerThirdSection extends GridFiller {

    constructor(suggestionsGetter: AbstractWordSuggestionsGetter) {
        super(suggestionsGetter);
        this.acrossWords = [
            new WordPlacement(new WordPosition(7, 6), 3, 3),
            new WordPlacement(new WordPosition(8, 6), 3, 3),
            new WordPlacement(new WordPosition(9, 2), 8, 8)
        ];
        this.verticalWords = [
            new WordPlacement(new WordPosition(7, 6), 3, 3),
            new WordPlacement(new WordPosition(7, 7), 3, 3),
            new WordPlacement(new WordPosition(7, 8), 3, 3)
        ];
    }

}
