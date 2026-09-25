import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShelfStats } from './shelf-stats';

describe('ShelfStats', () => {
  let component: ShelfStats;
  let fixture: ComponentFixture<ShelfStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfStats],
    }).compileComponents();

    fixture = TestBed.createComponent(ShelfStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
