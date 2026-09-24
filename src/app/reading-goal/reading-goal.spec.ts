import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadingGoal } from './reading-goal';

describe('ReadingGoal', () => {
  let component: ReadingGoal;
  let fixture: ComponentFixture<ReadingGoal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingGoal],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadingGoal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
