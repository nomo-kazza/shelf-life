import { Component, inject } from '@angular/core';
import { ShelfStats } from '../../shelf-stats/shelf-stats';
import { ShelfStore } from '../../shelf-store';
import { GoalForm } from '../../goal-form/goal-form';

@Component({
  selector: 'app-stats-page',
  imports: [ShelfStats, GoalForm],
  templateUrl: './stats-page.html',
})
export class StatsPage {
  protected readonly shelf = inject(ShelfStore);
}