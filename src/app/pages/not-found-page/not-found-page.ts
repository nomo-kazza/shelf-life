import { afterNextRender, Component, ElementRef, inject, Injector, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <h2 #pageHeading tabindex="-1">Page not found</h2>
    <p>That page doesn't exist. <a routerLink="/shelf">Back to your shelf</a>.</p>
  `,
})
export class NotFoundPage {
  private readonly injector = inject(Injector);
  private readonly pageHeading = viewChild<ElementRef<HTMLHeadingElement>>('pageHeading');

  constructor() {
    afterNextRender(() => this.pageHeading()?.nativeElement.focus(), { injector: this.injector });
  }
}