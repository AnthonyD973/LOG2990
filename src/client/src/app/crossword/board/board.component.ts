import { Component, OnInit } from '@angular/core';

const CROSSWORD: string[][] = [
    ['T', 'O', 'M', 'O', 'R', 'R', 'O', 'W', '0', 'O'],
    ['E', '0', 'E', '0', '0', 'I', '0', 'H', '0', 'N'],
    ['L', 'A', 'T', 'E', '0', 'N', 'O', 'I', 'S', 'E'],
    ['E', '0', 'R', '0', '0', 'D', '0', 'S', '0', ' '],
    ['T', 'O', 'M', 'O', 'R', 'R', 'O', 'W', '0', 'O'],
    ['E', '0', 'E', '0', '0', 'I', '0', 'H', '0', 'N'],
    ['L', 'A', 'T', 'E', '0', 'N', 'O', 'I', 'S', 'E'],
    ['E', '0', 'R', '0', '0', 'D', '0', 'S', '0', '0'],
    ['T', 'O', 'M', 'O', 'R', 'R', 'O', 'W', '0', 'O'],
    ['E', '0', 'E', '0', '0', 'I', '0', 'H', '0', 'N']];


@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

    public crossword = CROSSWORD;
    constructor() { }

    public ngOnInit(): void {
    }

}
