import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRating {
  readonly value = input.required<number>(); // parent must provide it
  readonly max = input(5);                   // optional, defaults to 5
  readonly rated = output<number>();         // emits the chosen star

  protected readonly stars = computed(() =>
    Array.from({ length: this.max() }, (_, i) => i + 1),
  );

  protected select(star: number): void {
    this.rated.emit(star);
  }
}