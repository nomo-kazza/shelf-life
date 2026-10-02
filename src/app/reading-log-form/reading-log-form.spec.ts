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
    fixture.componentRef.setInput('book', {
      id: 1,
      title: 'Test book',
      author: 'Test author',
      year: 2024,
      pages: 100,
      isbn: '1234567890',
      finished: false,
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders six labeled native rating radios', () => {
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    expect(radios.length).toBe(6);
    expect(fixture.nativeElement.querySelector('fieldset legend')?.textContent).toBe('Rating');
    expect(fixture.nativeElement.querySelector('label[for="rating-0"]')?.textContent).toBe('Not rated');
    expect(fixture.nativeElement.querySelector('label[for="rating-1"]')?.textContent.trim()).toBe('1 star');
    expect(fixture.nativeElement.querySelector('label[for="rating-5"]')?.textContent.trim()).toBe('5 stars');
    expect(fixture.nativeElement.querySelector('fieldset')?.hasAttribute('aria-describedby')).toBe(false);
  });
});
