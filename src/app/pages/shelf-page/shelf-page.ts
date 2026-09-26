import { Component, input } from '@angular/core';
import { ReadingGoal } from '../../reading-goal/reading-goal';
import { ShelfStats } from '../../shelf-stats/shelf-stats';
import { BookList } from '../../book-list/book-list';

@Component({
  selector: 'app-shelf-page',
  imports: [ReadingGoal, ShelfStats, BookList],
  templateUrl: './shelf-page.html',
})
export class ShelfPage {
  readonly filter = input<string>();
}