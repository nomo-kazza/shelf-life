import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ShelfStore } from '../../shelf-store';

interface SearchResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  isbn?: string[];
  cover_i?: number;
}

interface SearchResponse {
  docs: SearchResult[];
}

@Component({
  imports: [],
  selector: 'app-search-page',
  styleUrl: './search-page.css',
  templateUrl: './search-page.html',
})
export class SearchPage {
  protected readonly query = signal('');
  protected readonly shelf = inject(ShelfStore);

    protected readonly searchResource = httpResource<SearchResponse>(() => {
      const q = this.query().trim();
      if (!q) return undefined; // idle: no request
      return { url: 'https://openlibrary.org/search.json',
        params: { 
          q: this.query(), 
          limit: 10,
          fields: 'key,title,author_name,first_publish_year,number_of_pages_median,isbn,cover_i'
        }, 
      };
    });

  protected readonly searchResults = computed<SearchResult[]>(() =>
    this.searchResource.hasValue() ? this.searchResource.value().docs : [],
  );
  protected onSearch(event: Event, query: string): void {
    event.preventDefault();
    this.query.set(query.trim());
  }
  protected isOnShelf(result: SearchResult): boolean {
    const resultIsbns = (result.isbn ?? []).map((isbn) => this.normalizeIsbn(isbn));

    if (resultIsbns.length > 0) {
      return this.shelf.allBooks().some((book) => resultIsbns.includes(this.normalizeIsbn(book.isbn)));
    }

    return this.shelf.allBooks().some((book) =>
      this.normalizeTitle(book.title) === this.normalizeTitle(result.title)
      && book.year === result.first_publish_year,
    );
  }

  protected onAddBook(book: SearchResult): void {
    const newBook = {
      title: book.title,
      author: book.author_name?.join(', ') ?? 'Unknown Author',
      year: book.first_publish_year ?? 0,
      pages: book.number_of_pages_median ?? 0,
      isbn: book.isbn?.[0] ?? '',
    };
    this.shelf.addBook(newBook);
  }

  private normalizeIsbn(isbn: string): string {
    return isbn.replace(/[-\s]/g, '').toUpperCase();
  }

  private normalizeTitle(title: string): string {
    return title.trim().toLowerCase().replace(/\s+/g, ' ');
  }
}
