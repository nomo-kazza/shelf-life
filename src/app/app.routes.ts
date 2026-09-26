import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'shelf', pathMatch: 'full' },
  {
    path: 'shelf',
    title: 'My shelf · ShelfLife',
    loadComponent: () => import('./pages/shelf-page/shelf-page').then((m) => m.ShelfPage),
  },
  {
    path: 'stats',
    title: 'Stats · ShelfLife',
    loadComponent: () => import('./pages/stats-page/stats-page').then((m) => m.StatsPage),
  },
  {
    path: 'books/:id',
    title: 'Book · ShelfLife',
    loadComponent: () => import('./pages/book-detail-page/book-detail-page').then((m) => m.BookDetailPage),
  },
  {
    path: 'search',
    title: 'Search · ShelfLife',
    loadComponent: () => import('./pages/search-page/search-page').then((m) => m.SearchPage),
  },
  {
    path: '**',
    title: 'Page not found · ShelfLife',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];