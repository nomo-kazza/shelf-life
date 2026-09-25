import { Service, computed, signal } from '@angular/core';

@Service()
export class ReadingGoalStore {
  private readonly pages = signal(20);

  readonly dailyPages = this.pages.asReadonly();
  readonly weeklyPages = computed(() => this.pages() * 7);

  increase(): void {
    this.pages.update((p) => p + 5);
  }

  decrease(): void {
    this.pages.update((p) => Math.max(5, p - 5));
  }
}