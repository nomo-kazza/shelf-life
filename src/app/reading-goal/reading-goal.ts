import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-reading-goal',
  templateUrl: './reading-goal.html',
  styleUrl: './reading-goal.css',
})
export class ReadingGoal {
  protected readonly dailyPages = signal(20);

  protected readonly weeklyPages = computed(() => this.dailyPages() * 7);

  protected readonly intensity = computed(() => {
    const pages = this.dailyPages();
    if (pages >= 50) return 'Ambitious';
    if (pages >= 20) return 'Steady';
    return 'Gentle';
  });

  constructor() {
    // Side effect outside Angular's templates → effect is appropriate here
    effect(() => {
      document.title = `ShelfLife · ${this.dailyPages()} pages/day`;
    });
  }

  protected increase(): void {
    this.dailyPages.update((pages) => pages + 5);
  }

  protected decrease(): void {
    this.dailyPages.update((pages) => Math.max(5, pages - 5));
  }
}