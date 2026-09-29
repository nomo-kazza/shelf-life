import { Service, computed, effect, signal } from '@angular/core';

const STORAGE_KEY = 'shelflife:reading-goal';
const DEFAULT_PAGES = 20;

function loadDailyPages(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_PAGES; // first visit

    const parsed: unknown = JSON.parse(raw);
    const isValid =
      typeof parsed === 'number' && Number.isInteger(parsed) && parsed >= 1 && parsed <= 500;

    return isValid ? parsed : DEFAULT_PAGES;
  } catch {
    return DEFAULT_PAGES; // corrupted JSON or storage blocked
  }
}

@Service()
export class ReadingGoalStore {
  private readonly pages = signal(loadDailyPages());

  readonly dailyPages = this.pages.asReadonly();
  readonly weeklyPages = computed(() => this.pages() * 7);

  constructor() {
    effect(() => {
      const pages = this.pages();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
      } catch {
        // Storage full or blocked: keep working in memory rather than crashing
      }
    });
  }

  increase(): void {
    this.pages.update((p) => p + 5);
  }

  decrease(): void {
    this.pages.update((p) => Math.max(5, p - 5));
  }

  setDailyPages(pages: number): void {
    this.pages.set(pages);
  }
}
