// libs/features/iss/src/lib/pages/iss-notes-review.page.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

type ReviewNote = {
  id: string;
  date: string;
  consumer: string;
  staff: string;
  setting: 'on_site' | 'off_site';
  comment: string;
};

@Component({
  selector: 'iss-notes-review-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="vstack gap">
      <h2>ISS Notes Review</h2>
      <form [formGroup]="filters" class="row gap" (ngSubmit)="applyFilters()">
        <label>
          Consumer
          <input type="text" formControlName="consumer" />
        </label>
        <label>
          From
          <input type="date" formControlName="from" />
        </label>
        <label>
          To
          <input type="date" formControlName="to" />
        </label>
        <label>
          Setting
          <select formControlName="setting">
            <option value="">Any</option>
            <option value="on_site">On-Site</option>
            <option value="off_site">Off-Site</option>
          </select>
        </label>
        <button type="submit" class="btn btn-secondary">Filter</button>
      </form>

      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Consumer</th>
            <th>Staff</th>
            <th>Setting</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let n of filtered()">
            <td>{{ n.date }}</td>
            <td>{{ n.consumer }}</td>
            <td>{{ n.staff }}</td>
            <td>{{ n.setting }}</td>
            <td>{{ n.comment }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class IssNotesReviewPage {
  private fb = inject(FormBuilder);

  filters = this.fb.nonNullable.group({
    consumer: [''],
    from: [''],
    to: [''],
    setting: [''],
  });

  // mock notes for now — plug in facade later
  private all = signal<ReviewNote[]>([
    {
      id: '1',
      date: '2025-10-29',
      consumer: 'James Harris',
      staff: 'Andre',
      setting: 'off_site',
      comment: 'Bowling, community access.',
    },
    {
      id: '2',
      date: '2025-10-29',
      consumer: 'Mary Jones',
      staff: 'Tina',
      setting: 'on_site',
      comment: 'Art and leisure activities.',
    },
  ]);

  filtered = signal<ReviewNote[]>(this.all());

  applyFilters() {
    const f = this.filters.getRawValue();
    let list = this.all();

    if (f.consumer) {
      list = list.filter((n) =>
        n.consumer.toLowerCase().includes(f.consumer.toLowerCase())
      );
    }
    if (f.setting) {
      list = list.filter((n) => n.setting === f.setting);
    }
    if (f.from) {
      list = list.filter((n) => n.date >= f.from!);
    }
    if (f.to) {
      list = list.filter((n) => n.date <= f.to!);
    }

    this.filtered.set(list);
  }
}
