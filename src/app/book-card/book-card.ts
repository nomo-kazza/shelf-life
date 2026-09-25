import { Component, computed, input, output } from '@angular/core';
import { Book } from '../book';

@Component({
  imports: [],
  selector: 'app-book-card',
  styleUrl: './book-card.css',
  templateUrl: './book-card.html',
})
export class BookCard {

  book = input.required<Book>();
  toggled = output<number>()
  protected readonly isLongRead = computed(() => this.book().pages > 400);
  protected readonly coverUrl = computed(() => `https://covers.openlibrary.org/b/isbn/${this.book().isbn}-M.jpg`);

  toggleFinished(id: number) {
    this.toggled.emit(id);
  }
}
