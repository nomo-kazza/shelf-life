import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { Book } from '../book';
import { form, FormField, maxLength, min, required, validate } from '@angular/forms/signals';
import { ShelfStore } from '../shelf-store';

type Status = { text: string; type: 'idle' | 'success' | 'error' };

@Component({
  imports: [FormField],
  selector: 'app-reading-log-form',
  styleUrl: './reading-log-form.css',
  templateUrl: './reading-log-form.html',
})
export class ReadingLogForm {
  private readonly shelfStore = inject(ShelfStore);
  readonly book = input.required<Book>();

  protected readonly draft = linkedSignal(() => ({
    currentPage: this.book().currentPage ?? 0,
    rating: String(this.book().rating ?? 0),
    notes: this.book().notes ?? '',
  }));

  protected readonly counter = computed(() => this.draft().notes.length);
  
  protected readonly statusMessage = signal<Status>({ text: '', type: 'idle' });


  protected readonly logForm = form(this.draft, (path) => {
    required(path.currentPage, { message: 'Enter the page you are on.' });
    min(path.currentPage, 0, { message: 'Enter a valid page number.' });
    validate(path.currentPage, ({ value }) => {
      const book = this.book();
      return book.pages !== undefined && value() > book.pages
        ? { kind: 'exceedsBookPages', message: `Cannot exceed ${book.pages} pages.` }
        : undefined;
    });
    
    maxLength(path.notes, 500, { message: 'Keep notes to 500 characters or fewer.' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.logForm().invalid()) {
      this.logForm().markAsTouched(); // reveal all errors
      this.statusMessage.set({text: 'Please fix the errors above.', type: 'error'});
      return;
    }

    
    const currentPage = this.draft().currentPage;
    const rating = Number(this.draft().rating);
    const notes = this.draft().notes;
    

    this.shelfStore.updateLog(this.book().id, { currentPage, rating, notes });  
    this.statusMessage.set({text: 'Reading log saved.', type: 'success'});
  }
}
