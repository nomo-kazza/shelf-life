import { TestBed } from '@angular/core/testing';
import { ReadingGoalStore } from './reading-goal-store';

describe('ReadingGoalStore', () => {
  let service: ReadingGoalStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingGoalStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
