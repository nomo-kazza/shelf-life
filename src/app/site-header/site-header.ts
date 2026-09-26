import { Component, inject } from '@angular/core';
import { ReadingGoalStore } from '../reading-goal-store';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  path: string;
  count?: number;
}

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-site-header',
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  protected readonly appName = 'ShelfLife';
  protected readonly tagline = 'Track what you read.';
  protected readonly links: NavLink[] = [
    { label: 'Search', path: '/search' },
    { label: 'My shelf', path: '/shelf' },
    { label: 'Stats', path: '/stats' },
  ];
  protected readonly goal = inject(ReadingGoalStore);
}