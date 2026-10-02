import { isBook, loadBooks, SAMPLE_BOOKS, STORAGE_KEY } from './shelf-storage';

describe('shelf-storage', () => {
  const findBackupKey = () =>
    Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).find((key) =>
      key?.startsWith(`${STORAGE_KEY}:backup-`),
    );

  beforeEach(() => {
    localStorage.clear();
  });

  it('returns sample books on first visit with no issue', () => {
    const result = loadBooks();

    expect(result.books).toEqual(SAMPLE_BOOKS);
    expect(result.issue).toBe('none');
  });

  it('returns valid stored data unchanged', () => {
    const storedBooks = [
      {
        id: 7,
        title: 'The Left Hand of Darkness',
        author: 'Ursula K. Le Guin',
        year: 1969,
        pages: 304,
        isbn: '9780441478125',
        finished: false,
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, books: storedBooks }));

    const result = loadBooks();

    expect(result).toEqual({ books: storedBooks, issue: 'none' });
  });

  it('backs up corrupted JSON and returns an empty list with a corruption issue', () => {
    const raw = '{invalid json';
    localStorage.setItem(STORAGE_KEY, raw);

    const result = loadBooks();
    const backupKey = findBackupKey();

    expect(result.books).toEqual([]);
    expect(result.issue).toBe('corrupted');
    expect(backupKey).toBeTruthy();
    expect(localStorage.getItem(backupKey!)).toBe(raw);
  });

  it('treats an unsupported version as an empty fallback with an issue', () => {
    const raw = JSON.stringify({ version: 99, books: [] });
    localStorage.setItem(STORAGE_KEY, raw);

    const result = loadBooks();

    expect(result.books).toEqual([]);
    expect(result.issue).toBe('unsupportedVersion');
  });

  it('drops the whole shelf when a single book is invalid', () => {
    const raw = JSON.stringify({
      version: 1,
      books: [
        {
          id: 1,
          title: 'Valid Book',
          author: 'Author',
          year: 2024,
          pages: 200,
          isbn: '9781234567890',
          finished: false,
        },
        { id: 'nope', title: 'Bad Book' },
      ],
    });

    localStorage.setItem(STORAGE_KEY, raw);
    const result = loadBooks();

    expect(result.books).toEqual([]);
    expect(result.issue).toBe('corrupted');
  });

  it('recognizes valid book objects and rejects invalid ones', () => {
    expect(isBook({
      id: 1,
      title: 'A',
      author: 'B',
      year: 2024,
      pages: 10,
      isbn: '123',
      finished: false,
    })).toBe(true);

    expect(isBook({ id: 'oops' })).toBe(false);
  });
});
