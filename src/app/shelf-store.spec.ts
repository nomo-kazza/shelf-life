import { TestBed } from '@angular/core/testing';
import { ShelfStore } from './shelf-store';
import { STORAGE_KEY } from './shelf-storage';

describe('ShelfStore', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service = TestBed.inject(ShelfStore);
    expect(service).toBeTruthy();
    expect(service.loadIssue()).toBe('none');
  });

  it('falls back to an empty list and reports corruption when stored data is unusable', () => {
    const raw = '{invalid json';
    localStorage.setItem(STORAGE_KEY, raw);

    const service = TestBed.inject(ShelfStore);
    const backupKey = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
      .find((key) => key?.startsWith(`${STORAGE_KEY}:backup-`));

    expect(backupKey).toBeTruthy();
    expect(localStorage.getItem(backupKey!)).toBe(raw);
    expect(service.allBooks()).toEqual([]);
    expect(service.loadIssue()).toBe('corrupted');
  });
});
