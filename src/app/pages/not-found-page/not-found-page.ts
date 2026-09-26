import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <h2>Page not found</h2>
    <p>That page doesn't exist. <a routerLink="/shelf">Back to your shelf</a>.</p>
  `,
})
export class NotFoundPage {}