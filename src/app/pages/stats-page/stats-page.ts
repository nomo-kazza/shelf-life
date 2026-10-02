import { afterNextRender, Component, ElementRef, inject, Injector, viewChild } from '@angular/core';
import { ShelfStats } from '../../shelf-stats/shelf-stats';
import { ShelfStore } from '../../shelf-store';
import { GoalForm } from '../../goal-form/goal-form';

@Component({
  selector: 'app-stats-page',
  imports: [ShelfStats, GoalForm],
  templateUrl: './stats-page.html',
})
export class StatsPage {
  private readonly injector = inject(Injector);
  private readonly pageHeading = viewChild<ElementRef<HTMLHeadingElement>>('pageHeading');
  protected readonly shelf = inject(ShelfStore);

  constructor() {
    afterNextRender(() => this.pageHeading()?.nativeElement.focus(), { injector: this.injector });
  }

  protected resetToSampleBooks() {
    this.shelf.resetToSampleBooks();
  }
}