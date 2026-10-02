import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShelfPage } from './shelf-page';

describe('ShelfPage', () => {
  let component: ShelfPage;
  let fixture: ComponentFixture<ShelfPage>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ShelfPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create and focus the page heading', async () => {
    fixture = TestBed.createComponent(ShelfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('h2'));
  });

  it('announces a saved-shelf recovery message when loading is not clean', async () => {
    localStorage.setItem('shelflife:shelf', '{invalid json');
    fixture = TestBed.createComponent(ShelfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    const alert = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain(
      "We couldn't read your saved shelf, so we started fresh. A backup of the old data was kept.",
    );
  });
});
