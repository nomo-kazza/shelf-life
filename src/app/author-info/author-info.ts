import { Component, computed, input } from '@angular/core';
import { httpResource } from '@angular/common/http';

interface AuthorSearchResponse {
  numFound: number;
  docs: {
    key: string;
    name: string;
    birth_date?: string;
    top_work?: string;
    work_count: number;
  }[];
}

@Component({
  selector: 'app-author-info',
  templateUrl: './author-info.html',
  styleUrl: './author-info.css',
})
export class AuthorInfo {
  readonly name = input.required<string>();

  protected readonly authorResource = httpResource<AuthorSearchResponse>(() => ({
    url: 'https://openlibrary.org/search/authors.json',
    params: { q: this.name(), limit: 1 },
  }));

  protected readonly author = computed(() =>
    this.authorResource.hasValue() ? this.authorResource.value().docs[0] : undefined,
  );
}