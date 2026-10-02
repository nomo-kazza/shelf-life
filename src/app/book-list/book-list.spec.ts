import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Announcer } from '../announcer';
import { ShelfStore } from '../shelf-store';
import { BookList } from './book-list';

describe('BookList', () => {
  let component: BookList;
  let fixture: ComponentFixture<BookList>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [BookList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('focuses the next card title after removing a book', async () => {
    fixture.detectChanges();

    const firstCard = fixture.nativeElement.querySelector('app-book-card');
    firstCard.querySelectorAll('button')[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const nextCardTitle = fixture.nativeElement.querySelector('app-book-card a');
    expect(document.activeElement).toBe(nextCardTitle);
  });

  it('announces when removing the final book leaves the shelf empty', async () => {
    const shelfStore = TestBed.inject(ShelfStore);
    const remainingBook = shelfStore.allBooks()[0];
    shelfStore.allBooks().slice(1).forEach((book) => shelfStore.removeBook(book.id));
    fixture.detectChanges();
    const announce = vi.spyOn(TestBed.inject(Announcer), 'announce');

    fixture.nativeElement.querySelector('app-book-card button:last-child').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(announce).toHaveBeenCalledWith(`Removed "${remainingBook.title}". Your shelf is now empty.`);
    const emptyState = fixture.nativeElement.querySelector('p[tabindex="-1"]');
    expect(emptyState.textContent.trim()).toBe('No books in the list');
    expect(document.activeElement).toBe(emptyState);
  });

  it('sorts books by the selected field without changing the stored order', () => {
    fixture.detectChanges();

    const originalTitles = TestBed.inject(ShelfStore).allBooks().map((book) => book.title);
    const radioButtons = fixture.nativeElement.querySelectorAll('[role="radio"]') as NodeListOf<HTMLButtonElement>;
    Array.from(radioButtons)
      .find((radio) => radio.textContent?.trim() === 'Year')?.click();
    fixture.detectChanges();

    const sortedTitles = Array.from(
      fixture.nativeElement.querySelectorAll('app-book-card h2 a'),
      (link: HTMLAnchorElement) => link.textContent?.trim(),
    );
    expect(sortedTitles).toEqual(['Pocket ref', 'Death Note, Vol. 1', 'The Invisible Man', 'Do It Today']);
    expect(originalTitles).toEqual(['Do It Today', 'The Invisible Man', 'Pocket ref', 'Death Note, Vol. 1']);
  });

  it('sorts books with unknown page counts last and names the group from its visible label', () => {
    const shelfStore = TestBed.inject(ShelfStore);
    shelfStore.addBook({
      title: 'Unknown page count',
      author: 'Test author',
      year: 2025,
      isbn: '0000000000',
    });
    fixture.detectChanges();

    const pagesRadio = Array.from(
      fixture.nativeElement.querySelectorAll('[role="radio"]') as NodeListOf<HTMLButtonElement>,
    ).find((radio) => radio.textContent?.trim() === 'Pages');
    pagesRadio?.click();
    fixture.detectChanges();

    const sortedTitles = Array.from(
      fixture.nativeElement.querySelectorAll('app-book-card h2 a'),
      (link: HTMLAnchorElement) => link.textContent?.trim(),
    );
    const sortGroup = fixture.nativeElement.querySelector('[role="radiogroup"]');
    expect(sortedTitles.at(-1)).toBe('Unknown page count');
    expect(sortGroup.getAttribute('aria-labelledby')).toBe('sort-label');
    expect(fixture.nativeElement.querySelector('#sort-label').textContent.trim()).toBe('Sort');
    expect(sortGroup.hasAttribute('aria-label')).toBe(false);
  });
});
