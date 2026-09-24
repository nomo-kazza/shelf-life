import { Component } from '@angular/core';
import { Book } from '../book';

@Component({
  imports: [],
  selector: 'app-book-list',
  styleUrl: './book-list.css',
  templateUrl: './book-list.html',
})
export class BookList {
  protected readonly books: Book[] = [
    {
      id: 1,
      title: 'Do It Today',
      author: 'Darius Foroux',
      year: '2018',
      pages: 143,
      isbn: '9780143452126',
      finished: false
    },
    {
      id: 2,
      title: 'The Invisible Man',
      author: 'H. G. Wells',
      year: '2015',
      pages: 350,
      isbn: '0198702671',
      finished: true
    },
    {
      id: 3,
      title: 'Pocket ref',
      author: 'Thomas J. Glover',
      year: '1996',
      pages: 450,
      isbn: '1885071000',
      finished: false
    },
    {
      id: 4,
      title: 'Death Note, Vol. 1',
      author: 'Tsugumi Ohba and Takeshi Obata',
      year: '2005',
      pages: 250,
      isbn: '9781421501680',
      finished: false
    },
  ];
}
