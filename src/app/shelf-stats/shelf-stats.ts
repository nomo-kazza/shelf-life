import { Component, inject } from '@angular/core';
import { ShelfStore } from '../shelf-store';

@Component({
  imports: [],
  selector: 'app-shelf-stats',
  styleUrl: './shelf-stats.css',
  templateUrl: './shelf-stats.html',
})
export class ShelfStats {
  protected readonly shelfStore = inject(ShelfStore);
}

