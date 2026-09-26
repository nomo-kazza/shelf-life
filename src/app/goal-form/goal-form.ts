import { Component, inject, signal } from '@angular/core';
import { form, FormField, max, min, required } from '@angular/forms/signals';
import { ReadingGoalStore } from '../reading-goal-store';

interface GoalDraft {
  dailyPages: number;
}

@Component({
  selector: 'app-goal-form',
  imports: [FormField],
  templateUrl: './goal-form.html',
  styleUrl: './goal-form.css',
})
export class GoalForm {
  private readonly goal = inject(ReadingGoalStore);

  // Snapshot of the store's value: the service already exists, so reading it here is safe
  protected readonly draft = signal<GoalDraft>({ dailyPages: this.goal.dailyPages() });

  protected readonly goalForm = form(this.draft, (path) => {
    required(path.dailyPages, { message: 'Enter how many pages per day.' });
    min(path.dailyPages, 1, { message: 'Aim for at least 1 page a day.' });
    max(path.dailyPages, 500, { message: 'Keep it at 500 pages or fewer.' });
  });

  protected readonly statusMessage = signal('');

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.goalForm().invalid()) {
      this.goalForm().markAsTouched(); // reveal all errors
      this.statusMessage.set('Please fix the errors above.');
      return;
    }

    this.goal.setDailyPages(this.draft().dailyPages);
    this.statusMessage.set('Goal saved.');
  }
}