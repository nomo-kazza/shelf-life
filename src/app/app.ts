import { Component, inject, signal } from '@angular/core';
import { SiteHeader } from './site-header/site-header';
import { RouterOutlet } from '@angular/router';
import { StarRating } from './star-rating/star-rating';
import { Announcer } from './announcer';

@Component({
  selector: 'app-root',
  imports: [SiteHeader, RouterOutlet, StarRating],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly announcer = inject(Announcer);
  protected readonly myRating = signal(3);
}