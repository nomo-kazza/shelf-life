import { Component, inject, input } from '@angular/core';
import { ReadingGoal } from '../../reading-goal/reading-goal';
import { ShelfStats } from '../../shelf-stats/shelf-stats';
import { BookList } from '../../book-list/book-list';
import { ShelfStore } from '../../shelf-store';

@Component({
  selector: 'app-shelf-page',
  imports: [ReadingGoal, ShelfStats, BookList],
  styleUrl: './shelf-page.css',
  templateUrl: './shelf-page.html',
})
export class ShelfPage {
  private readonly shelfStore = inject(ShelfStore);
  readonly loadIssue = this.shelfStore.loadIssue;
  readonly filter = input<string>();
}