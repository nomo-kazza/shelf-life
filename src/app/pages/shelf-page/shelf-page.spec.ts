import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShelfPage } from './shelf-page';

describe('ShelfPage', () => {
  let component: ShelfPage;
  let fixture: ComponentFixture<ShelfPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ShelfPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
