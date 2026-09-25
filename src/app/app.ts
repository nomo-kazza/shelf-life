import { Component, signal } from '@angular/core';
import { SiteHeader } from './site-header/site-header';
import { BookCard } from './book-card/book-card';
import { BookList } from './book-list/book-list';
import { ReadingGoal } from './reading-goal/reading-goal';
import { StarRating } from './star-rating/star-rating';
import { ShelfStats } from './shelf-stats/shelf-stats';

@Component({
  selector: 'app-root',
  imports: [SiteHeader, BookList, ReadingGoal, StarRating, ShelfStats],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  
  protected readonly myRating = signal(3);
}