import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ShelfStore } from '../../shelf-store';

@Component({
  imports: [RouterLink],
  selector: 'app-book-detail-page',
  styleUrl: './book-detail-page.css',
  templateUrl: './book-detail-page.html',
})
export class BookDetailPage {
  private readonly router = inject(Router);
  readonly id = input.required({ transform: numberAttribute });
  protected readonly shelf = inject(ShelfStore);
  protected readonly book = computed(() => this.shelf.allBooks().find((book) => book.id === this.id()));
  protected readonly isLongRead = computed(() => (this.book()?.pages ?? 0) > 400);
  protected readonly coverUrl = computed(() => `https://covers.openlibrary.org/b/isbn/${this.book()?.isbn}-L.jpg`);

  protected onToggle(): void {
    this.shelf.toggleFinished(this.id());
  }

  protected onRemove(): void {
    this.shelf.removeBook(this.id());
    this.router.navigate(['/shelf']);
  }

}
