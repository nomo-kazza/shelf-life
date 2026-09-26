import { Component, computed, inject, input } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { ShelfStore } from '../shelf-store';
import { Router } from '@angular/router';


@Component({
  imports: [BookCard],
  selector: 'app-book-list',
  styleUrl: './book-list.css',
  templateUrl: './book-list.html',
})
export class BookList {
  private readonly router = inject(Router);
  readonly filter = input<string>();
  protected readonly shelfStore = inject(ShelfStore);
  protected readonly showUnfinishedOnly = computed(() => this.filter() === 'unfinished');
  protected readonly visibleBooks = computed(() => {
    const books = this.shelfStore.allBooks();
    return this.showUnfinishedOnly() ? books.filter((book) => !book.finished) : books;
  });

  protected toggleFilter(): void {
    this.router.navigate([], { 
      queryParams: { filter: this.showUnfinishedOnly() ? null : 'unfinished' },
      queryParamsHandling: 'merge',
    });
  }
}

