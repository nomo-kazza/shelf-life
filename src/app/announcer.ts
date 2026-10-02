import { Service, signal } from '@angular/core';

@Service()
export class Announcer {
  private readonly text = signal('');
  private timer?: ReturnType<typeof setTimeout>;
  readonly message = this.text.asReadonly();

  announce(message: string): void {
    clearTimeout(this.timer);
    this.text.set('');
    this.timer = setTimeout(() => this.text.set(message), 100);
  }
}