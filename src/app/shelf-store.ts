import { computed, effect, Service, signal } from '@angular/core';
import { Book } from './book';
import {
    SAMPLE_BOOKS,
    STORAGE_KEY,
    type ShelfLoadIssue,
    loadBooks,
} from './shelf-storage';

@Service()
export class ShelfStore {
    private readonly initialLoad = loadBooks();
    private readonly books = signal<Book[]>(this.initialLoad.books);
    private readonly loadIssueState = signal<ShelfLoadIssue>(this.initialLoad.issue);
    readonly allBooks = this.books.asReadonly();
    readonly loadIssue = this.loadIssueState.asReadonly();
 
    readonly finishedBooks = computed(() => this.books().filter((book) => book.finished));
    readonly finishedCount = computed(() => this.finishedBooks().length);
    readonly pagesReadCount = computed(() => this.finishedBooks().reduce((total, book) => total + (book.pages ?? 0), 0));
    readonly progress = computed(() => {
        const totalBooks = this.books().length;
        return totalBooks > 0 ? Math.round((this.finishedCount() / totalBooks) * 100) : 0;
    });

    constructor() {
        effect(() => {
            const books = this.books();
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({version: 1, books: books}));
            } catch {
                // Storage full or blocked: keep working in memory rather than crashing
            }
            
        });
        window.addEventListener('storage', (event) => {
            if (event.key === STORAGE_KEY) {
                const newLoad = loadBooks();
                this.books.set(newLoad.books);
                this.loadIssueState.set(newLoad.issue);
            }
        });
    }

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

    addBook(newBook: Omit<Book, 'id' | 'finished'>): void {
        this.books.update((books) => [...books, {...newBook,
            id: Math.max(0, ...books.map(item => item.id)) + 1,
            finished: false
        }]);
    }
    updateLog(bookId: number, log: Pick<Book, 'currentPage' | 'rating' | 'notes'>): void {
        this.books.update((books) =>
            books.map((book) =>
                book.id === bookId ? { ...book, ...log } : book
            )
        );
    }

    resetToSampleBooks(): void {
        this.books.set([...SAMPLE_BOOKS]);
    }
}

