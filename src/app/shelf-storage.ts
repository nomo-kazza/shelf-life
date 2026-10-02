import { Book } from './book';

export const STORAGE_KEY = 'shelflife:shelf';
const BACKUP_KEY_PREFIX = `${STORAGE_KEY}:backup-`;

export type ShelfLoadIssue = 'none' | 'corrupted' | 'unsupportedVersion';

export interface ShelfLoadResult {
  books: Book[];
  issue: ShelfLoadIssue;
}

export const SAMPLE_BOOKS: Book[] = [
  {
    id: 1,
    title: 'Do It Today',
    author: 'Darius Foroux',
    year: 2018,
    pages: 143,
    isbn: '9780143452126',
    finished: false,
  },
  {
    id: 2,
    title: 'The Invisible Man',
    author: 'H. G. Wells',
    year: 2015,
    pages: 350,
    isbn: '0198702671',
    finished: true,
  },
  {
    id: 3,
    title: 'Pocket ref',
    author: 'Thomas J. Glover',
    year: 1996,
    pages: 450,
    isbn: '1885071000',
    finished: false,
  },
  {
    id: 4,
    title: 'Death Note, Vol. 1',
    author: 'Tsugumi Ohba and Takeshi Obata',
    year: 2005,
    pages: 250,
    isbn: '9781421501680',
    finished: false,
  },
];

export function isBook(value: unknown): value is Book {
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

export function backupStoredValue(raw: string): void {
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

export function loadBooks(): ShelfLoadResult {
  let raw: string | null = null;

  try {
    raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { books: [...SAMPLE_BOOKS], issue: 'none' };

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      backupStoredValue(raw);
      return { books: [], issue: 'corrupted' };
    }

    const shelf = parsed as { version?: unknown; books?: unknown };
    if (shelf.version !== 1) {
      backupStoredValue(raw);
      return {
        books: [],
        issue: Object.hasOwn(shelf, 'version') ? 'unsupportedVersion' : 'corrupted',
      };
    }

    if (!Array.isArray(shelf.books)) {
      backupStoredValue(raw);
      return { books: [], issue: 'corrupted' };
    }

    const books = shelf.books as unknown[];
    if (!books.every(isBook)) {
      backupStoredValue(raw);
      return { books: [], issue: 'corrupted' };
    }

    return { books, issue: 'none' };
  } catch {
    if (raw !== null) backupStoredValue(raw);
    return { books: [], issue: 'corrupted' };
  }
}
