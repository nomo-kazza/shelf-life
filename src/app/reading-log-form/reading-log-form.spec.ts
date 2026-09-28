import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadingLogForm } from './reading-log-form';

describe('ReadingLogForm', () => {
  let component: ReadingLogForm;
  let fixture: ComponentFixture<ReadingLogForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingLogForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadingLogForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
