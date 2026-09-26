import { Component, computed, input, output } from '@angular/core';
import { Book } from '../book';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-book-card',
  styleUrl: './book-card.css',
  templateUrl: './book-card.html',
})
export class BookCard {
  readonly book = input.required<Book>();
  readonly toggled = output<number>();
  readonly removed = output<number>();
  protected readonly isLongRead = computed(() => this.book().pages > 400);
  protected readonly coverUrl = computed(() => `https://covers.openlibrary.org/b/isbn/${this.book().isbn}-M.jpg`);

  protected onToggle() {
    this.toggled.emit(this.book().id);
  }
  protected onRemove() {
    this.removed.emit(this.book().id);
  }
}
