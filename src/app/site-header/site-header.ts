import { Component } from '@angular/core';

interface NavLink {
  label: string;
  path: string;
  count?: number;
}

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  protected readonly appName = 'ShelfLife';
  protected readonly tagline = 'Track what you read.';
  protected readonly currentPath = '/shelf';
  protected readonly links: NavLink[] = [
    { label: 'Search', path: '/search' },
    { label: 'My shelf', path: '/shelf', count: 3 },
    { label: 'Stats', path: '/stats' },
  ];
}