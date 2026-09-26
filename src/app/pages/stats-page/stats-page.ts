import { Component, inject } from '@angular/core';
import { ShelfStats } from '../../shelf-stats/shelf-stats';
import { ShelfStore } from '../../shelf-store';

@Component({
  selector: 'app-stats-page',
  imports: [ShelfStats],
  templateUrl: './stats-page.html',
})
export class StatsPage {
  protected readonly shelf = inject(ShelfStore);
}