// libs/features/iss/src/lib/pages/iss-notes-gallery.page.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

type GalleryNote = {
  id: string;
  date: string;
  consumer: string;
  comment: string;
  tag?: string;
};

@Component({
  selector: 'lib-iss-notes-gallery-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="vstack gap">
      <h2>ISS Notes Gallery</h2>
      <form [formGroup]="filters" class="row gap">
        <label>
          Search
          <input type="text" formControlName="q" (input)="applyFilters()" />
        </label>
        <label>
          Consumer
          <input type="text" formControlName="consumer" (input)="applyFilters()" />
        </label>
      </form>

      <div class="gallery">
        <article *ngFor="let n of filtered()" class="card">
          <header>
            <strong>{{ n.consumer }}</strong>
            <small>{{ n.date }}</small>
          </header>
          <p>{{ n.comment }}</p>
          <small *ngIf="n.tag">#{{ n.tag }}</small>
        </article>
      </div>
    </div>
  `,
  styles: [
    `
      .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1rem;
      }
      .card {
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
        padding: 0.75rem;
        background: #fff;
      }
    `,
  ],
})
export class IssNotesGalleryPage {
  private fb = inject(FormBuilder);

  filters = this.fb.nonNullable.group({
    q: [''],
    consumer: [''],
  });

  private all = signal<GalleryNote[]>([
    {
      id: 'n1',
      date: '2025-10-28',
      consumer: 'James Harris',
      comment: 'Off-site community outing to library.',
      tag: 'off_site',
    },
    {
      id: 'n2',
      date: '2025-10-27',
      consumer: 'Mary Jones',
      comment: 'On-site: skills training and ADLs.',
      tag: 'on_site',
    },
  ]);

  filtered = signal<GalleryNote[]>(this.all());

  applyFilters() {
    const f = this.filters.getRawValue();
    let list = this.all();

    if (f.q) {
      const q = f.q.toLowerCase();
      list = list.filter(
        (n) =>
          n.comment.toLowerCase().includes(q) ||
          n.consumer.toLowerCase().includes(q)
      );
    }
    if (f.consumer) {
      const c = f.consumer.toLowerCase();
      list = list.filter((n) => n.consumer.toLowerCase().includes(c));
    }

    this.filtered.set(list);
  }
}
