import { TestBed } from '@angular/core/testing';
import { ShelfStore } from './shelf-store';

describe('ShelfStore', () => {
  let service: ShelfStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    service = TestBed.inject(ShelfStore);
    expect(service).toBeTruthy();
    expect(service.loadIssue()).toBe('none');
  });

  it('backs up an unusable stored value before falling back', () => {
    const raw = '{invalid json';
    localStorage.setItem('shelflife:shelf', raw);

    service = TestBed.inject(ShelfStore);

    const backupKey = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
      .find((key) => key?.startsWith('shelflife:shelf:backup-'));
    expect(backupKey).toBeTruthy();
    expect(localStorage.getItem(backupKey!)).toBe(raw);
    expect(service.allBooks()).toEqual([]);
    expect(service.loadIssue()).toBe('corrupted');
  });

  it('reports and backs up an unsupported storage version', () => {
    const raw = JSON.stringify({ version: 2, books: [] });
    localStorage.setItem('shelflife:shelf', raw);

    service = TestBed.inject(ShelfStore);

    const backupKey = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
      .find((key) => key?.startsWith('shelflife:shelf:backup-'));
    expect(backupKey).toBeTruthy();
    expect(localStorage.getItem(backupKey!)).toBe(raw);
    expect(service.loadIssue()).toBe('unsupportedVersion');
  });
});
