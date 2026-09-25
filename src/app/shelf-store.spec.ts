import { TestBed } from '@angular/core/testing';
import { ShelfStore } from './shelf-store';

describe('ShelfStore', () => {
  let service: ShelfStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShelfStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
