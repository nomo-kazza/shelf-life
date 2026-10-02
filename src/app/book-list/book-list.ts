import { afterNextRender, Component, computed, ElementRef, inject, Injector, input, signal, viewChild, viewChildren } from '@angular/core';
import { Toolbar, ToolbarWidget, ToolbarWidgetGroup } from '@angular/aria/toolbar';
import { BookCard } from '../book-card/book-card';
import { ShelfStore } from '../shelf-store';
import { Router } from '@angular/router';
import { Announcer } from '../announcer';


@Component({
  imports: [BookCard, Toolbar, ToolbarWidget, ToolbarWidgetGroup],
  selector: 'app-book-list',
  styleUrl: './book-list.css',
  templateUrl: './book-list.html',
})
export class BookList {
  private readonly announcer = inject(Announcer);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly bookCards = viewChildren(BookCard);
  private readonly emptyState = viewChild<ElementRef<HTMLElement>>('emptyState');
  readonly filter = input<string>();
  protected readonly sortBy = signal<'title' | 'year' | 'pages'>('title');
  protected readonly shelfStore = inject(ShelfStore);
  protected readonly showUnfinishedOnly = computed(() => this.filter() === 'unfinished');
  protected readonly visibleBooks = computed(() => {
    const books = this.shelfStore.allBooks();
    const filteredBooks = this.showUnfinishedOnly() ? books.filter((book) => !book.finished) : books;
    const sortBy = this.sortBy();
    return [...filteredBooks].sort((a, b) => {
      switch (sortBy) {
        case 'year':
          return a.year - b.year;
        case 'pages': {
          if (a.pages === undefined) return b.pages === undefined ? 0 : 1;
          if (b.pages === undefined) return -1;
          return a.pages - b.pages;
        }
        case 'title':
          return a.title.localeCompare(b.title);
      }
    });
  });


  protected toggleFilter(): void {
    this.router.navigate([], { 
      queryParams: { filter: this.showUnfinishedOnly() ? null : 'unfinished' },
      queryParamsHandling: 'merge',
    });
  }

  protected onRemoved(id: number): void {
    const book = this.shelfStore.allBooks().find((b) => b.id === id);
    const removedIndex = this.visibleBooks().findIndex((b) => b.id === id);
    this.shelfStore.removeBook(id);
    if (book) {
      const message = this.shelfStore.allBooks().length === 0
        ? `Removed "${book.title}". Your shelf is now empty.`
        : `Removed "${book.title}" from your shelf.`;
      this.announcer.announce(message);
    }

    afterNextRender(() => {
      const cards = this.bookCards();
      if (cards.length > 0) {
        cards[Math.min(Math.max(removedIndex, 0), cards.length - 1)].focusTitle();
      } else {
        this.emptyState()?.nativeElement.focus();
      }
    }, { injector: this.injector });
  }
}

