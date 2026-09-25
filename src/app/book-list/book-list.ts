import { Component, computed, inject, signal } from '@angular/core';
import { Book } from '../book';
import { BookCard } from '../book-card/book-card';
import { ShelfStore } from '../shelf-store';

@Component({
  imports: [BookCard],
  selector: 'app-book-list',
  styleUrl: './book-list.css',
  templateUrl: './book-list.html',
})
export class BookList {
  protected readonly shelfStore = inject(ShelfStore);
  protected readonly showUnfinishedOnly = signal(false);
  protected readonly visibleBooks = computed(() => {
    const books = this.shelfStore.allBooks();
    return this.showUnfinishedOnly() ? books.filter((book) => !book.finished) : books;
  });

  protected toggleFilter(): void {
    this.showUnfinishedOnly.update((value) => !value);
  }
}

