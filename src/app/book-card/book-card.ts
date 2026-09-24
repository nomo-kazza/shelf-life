import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-book-card',
  styleUrl: './book-card.css',
  templateUrl: './book-card.html',
})
export class BookCard {
  protected readonly title = "First book title";
  protected readonly author = 'First book author';
  protected readonly year = 2021;
  protected readonly pages = 300;
}
