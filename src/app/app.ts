import { Component } from '@angular/core';
import { SiteHeader } from './site-header/site-header';
import { BookCard } from './book-card/book-card';
import { BookList } from './book-list/book-list';

@Component({
  selector: 'app-root',
  imports: [SiteHeader, BookList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}