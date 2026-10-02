import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SearchPage } from './search-page';

describe('SearchPage', () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps one empty status region while idle', () => {
    const statuses = fixture.nativeElement.querySelectorAll('[role="status"]');
    expect(statuses.length).toBe(1);
    expect(statuses[0].textContent.trim()).toBe('');
  });

  it('focuses the page heading after rendering', () => {
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('h2'));
  });

  it('announces loading and the result count', async () => {
    const input = fixture.nativeElement.querySelector('#search') as HTMLInputElement;
    input.value = 'dune';
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]').textContent.trim()).toBe('Searching…');
    const request = httpTesting.expectOne((req) => req.url === 'https://openlibrary.org/search.json');
    request.flush({ docs: Array.from({ length: 10 }, (_, index) => ({ key: `/works/${index}`, title: `Book ${index}` })) });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[role="status"]').textContent.trim()).toBe('10 results for "dune"');
  });

  it('announces when a search has no results', async () => {
    const input = fixture.nativeElement.querySelector('#search') as HTMLInputElement;
    input.value = 'xyz';
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const request = httpTesting.expectOne((req) => req.url === 'https://openlibrary.org/search.json');
    request.flush({ docs: [] });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[role="status"]').textContent.trim()).toBe('No results for "xyz"');
  });

  it('keeps request failures in an alert, separate from the status region', async () => {
    const input = fixture.nativeElement.querySelector('#search') as HTMLInputElement;
    input.value = 'dune';
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const request = httpTesting.expectOne((req) => req.url === 'https://openlibrary.org/search.json');
    request.flush('Request failed', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('[role="status"]').length).toBe(1);
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent.trim()).toBe('');
  });
});
