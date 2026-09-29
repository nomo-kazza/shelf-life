import { computed, effect, Service, signal } from '@angular/core';
import { Book } from './book';

const STORAGE_KEY = 'shelflife:shelf';
const BACKUP_KEY_PREFIX = `${STORAGE_KEY}:backup-`;
type ShelfLoadIssue = 'none' | 'corrupted' | 'unsupportedVersion';

interface ShelfLoadResult {
    books: Book[];
    issue: ShelfLoadIssue;
}

const SAMPLE_BOOKS: Book[] = [
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
    ]

function isBook(value: unknown): value is Book {
    if (typeof value !== 'object' || value === null) return false;
    const book = value as Book;
    return (
        typeof book.id === 'number' &&
        typeof book.title === 'string' &&
        typeof book.author === 'string' &&
        typeof book.year === 'number' &&
        (book.pages === undefined || typeof book.pages === 'number') &&
        typeof book.isbn === 'string' &&
        typeof book.finished === 'boolean' &&
        (book.currentPage === undefined || typeof book.currentPage === 'number') &&
        (book.rating === undefined || typeof book.rating === 'number') &&
        (book.notes === undefined || typeof book.notes === 'string')
    );
}

function backupStoredValue(raw: string): void {
    try {
        const timestamp = Date.now();
        let key = `${BACKUP_KEY_PREFIX}${timestamp}`;
        let suffix = 1;
        while (localStorage.getItem(key) !== null) {
            key = `${BACKUP_KEY_PREFIX}${timestamp}-${suffix++}`;
        }
        localStorage.setItem(key, raw);
    } catch {
        // Keep falling back if storage is blocked or there is no room for a backup.
    }
}

function loadBooks(): ShelfLoadResult {
    let raw: string | null = null;
    try {
        raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return { books: [...SAMPLE_BOOKS], issue: 'none' }; // first visit

        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) {
            backupStoredValue(raw);
            return { books: [...SAMPLE_BOOKS], issue: 'corrupted' };
        }

        const shelf = parsed as { version?: unknown; books?: unknown };
        if (shelf.version !== 1) {
            backupStoredValue(raw);
            return {
                books: [...SAMPLE_BOOKS],
                issue: Object.hasOwn(shelf, 'version') ? 'unsupportedVersion' : 'corrupted',
            };
        }

        if (!Array.isArray(shelf.books)) {
            backupStoredValue(raw);
            return { books: [...SAMPLE_BOOKS], issue: 'corrupted' };
        }

        const books = shelf.books as unknown[];
        if (!books.every(isBook)) {
            backupStoredValue(raw);
            return { books: [], issue: 'corrupted' };
        }

        return { books, issue: 'none' };
    } catch {
        if (raw !== null) backupStoredValue(raw);
        return { books: [], issue: 'corrupted' }; // corrupted JSON or storage blocked
    }
}

@Service()
export class ShelfStore {
    private readonly initialLoad = loadBooks();
    private readonly books = signal<Book[]>(this.initialLoad.books);
    private readonly loadIssueState = signal<ShelfLoadIssue>(this.initialLoad.issue);
    readonly allBooks = this.books.asReadonly();
    readonly loadIssue = this.loadIssueState.asReadonly();
 
    readonly finishedBooks = computed(() => this.books().filter((book) => book.finished));
    readonly finishedCount = computed(() => this.finishedBooks().length);
    readonly pagesReadCount = computed(() => this.finishedBooks().reduce((total, book) => total + (book.pages ?? 0) , 0));
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

