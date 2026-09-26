import { computed, InputSignalWithTransform, Service, signal } from '@angular/core';
import { Book } from './book';

@Service()
export class ShelfStore {
    private readonly books = signal<Book[]>([
        {
        id: 1,
        title: 'Do It Today',
        author: 'Darius Foroux',
        year: 2018,
        pages: 143,
        isbn: '9780143452126',
        finished: false
        },
        {
        id: 2,
        title: 'The Invisible Man',
        author: 'H. G. Wells',
        year: 2015,
        pages: 350,
        isbn: '0198702671',
        finished: true
        },
        {
        id: 3,
        title: 'Pocket ref',
        author: 'Thomas J. Glover',
        year: 1996,
        pages: 450,
        isbn: '1885071000',
        finished: false
        },
        {
        id: 4,
        title: 'Death Note, Vol. 1',
        author: 'Tsugumi Ohba and Takeshi Obata',
        year: 2005,
        pages: 250,
        isbn: '9781421501680',
        finished: false
        }
    ]);

    readonly allBooks = this.books.asReadonly();
 
    readonly finishedBooks = computed(() => this.books().filter((book) => book.finished));
    readonly finishedCount = computed(() => this.finishedBooks().length);
    readonly pagesReadCount = computed(() => this.finishedBooks().reduce((total, book) => total + book.pages, 0));
    readonly progress = computed(() => {
        const totalBooks = this.books().length;
        return totalBooks > 0 ? Math.round((this.finishedCount() / totalBooks) * 100) : 0;
    });

    toggleFinished(bookId: number): void {
        this.books.update((books) =>
            books.map((book) =>
                book.id === bookId ? { ...book, finished: !book.finished } : book
            )
        );
    }

    removeBook(bookId: number): void {
        this.books.update((books) => books.filter((book) => book.id !== bookId));
    }
}

