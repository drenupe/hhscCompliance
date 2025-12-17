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
  selector: 'lib-iss-notes-review-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="vstack gap">
      <h2>ISS Notes Review</h2>

      <form [formGroup]="filters" class="row gap" (ngSubmit)="applyFilters()">
        <label for="nr-consumer">Consumer</label>
        <input id="nr-consumer" type="text" formControlName="consumer" />

        <label for="nr-from">From</label>
        <input id="nr-from" type="date" formControlName="from" />

        <label for="nr-to">To</label>
        <input id="nr-to" type="date" formControlName="to" />

        <label for="nr-setting">Setting</label>
        <select id="nr-setting" formControlName="setting">
          <option value="">Any</option>
          <option value="on_site">On-Site</option>
          <option value="off_site">Off-Site</option>
        </select>

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

  applyFilters(): void {
    const f = this.filters.getRawValue();
    let list = this.all();

    const consumer = f.consumer.trim().toLowerCase();
    const setting = f.setting;
    const from = f.from; // already '' when empty (nonNullable)
    const to = f.to;

    if (consumer) {
      list = list.filter((n) => n.consumer.toLowerCase().includes(consumer));
    }

    if (setting) {
      list = list.filter((n) => n.setting === setting);
    }

    if (from) {
      list = list.filter((n) => n.date >= from);
    }

    if (to) {
      list = list.filter((n) => n.date <= to);
    }

    this.filtered.set(list);
  }
}
