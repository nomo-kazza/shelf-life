import { Component, computed, effect, inject } from '@angular/core';
import { ReadingGoalStore } from '../reading-goal-store';

@Component({
  selector: 'app-reading-goal',
  templateUrl: './reading-goal.html',
  styleUrl: './reading-goal.css',
})
export class ReadingGoal {
  protected readonly goal = inject(ReadingGoalStore);

  protected readonly intensity = computed(() => {
    const pages = this.goal.dailyPages();
    if (pages >= 50) return 'Ambitious';
    if (pages >= 20) return 'Steady';
    return 'Gentle';
  });

  constructor() {
    // effect(() => {
    //   document.title = `ShelfLife · ${this.goal.dailyPages()} pages/day`;
    // });
  }
}