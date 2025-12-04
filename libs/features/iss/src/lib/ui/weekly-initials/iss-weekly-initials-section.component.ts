import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-iss-weekly-initials-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- use global iss-fieldset to match other sections -->
    <fieldset class="iss-fieldset iss-weekly-fieldset">
      <legend>{{ legend }}</legend>

      <div
        class="iss-weekly"
        [class.iss-weekly--mobile]="mobile"
      >
        <!-- Header row (desktop / default) -->
        <div class="iss-weekly-header">
          <div class="cell area">Area</div>
          <div class="cell day center">Mon</div>
          <div class="cell day center">Tue</div>
          <div class="cell day center">Wed</div>
          <div class="cell day center">Thu</div>
          <div class="cell day center">Fri</div>
        </div>

        <!-- Data rows -->
        <div
          class="iss-weekly-row"
          *ngFor="let group of rows.controls; trackBy: trackByIndex; let i = index"
          [formGroup]="group"
        >
          <div class="cell area">
            <input class="label-in" formControlName="label" readonly />
          </div>

          <div class="cell day">
            <input class="day-in" formControlName="mon" />
          </div>
          <div class="cell day">
            <input class="day-in" formControlName="tue" />
          </div>
          <div class="cell day">
            <input class="day-in" formControlName="wed" />
          </div>
          <div class="cell day">
            <input class="day-in" formControlName="thu" />
          </div>
          <div class="cell day">
            <input class="day-in" formControlName="fri" />
          </div>
        </div>
      </div>
    </fieldset>
  `,
  styles: [/* === your big CSS block unchanged === */ `
    .iss-weekly-fieldset {
      margin-bottom: 0.75rem;
    }

    .iss-weekly-fieldset > legend {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 0 0.35rem;
      margin-left: 0.15rem;
      margin-bottom: 0.35rem;
      color: #bbf7d0; /* light green, matches ISS theme */
    }

    .iss-weekly {
      border: 1px solid rgba(34, 197, 94, 0.32);
      background:
        radial-gradient(
          900px 650px at 0% 0%,
          rgba(34, 197, 94, 0.16),
          transparent 55%
        ),
        #020617;
      font-size: 0.8rem;
      width: 100%;
      box-sizing: border-box;
      color: #e5e7eb;
      border-radius: 0.7rem;
      box-shadow: 0 10px 22px rgba(0, 0, 0, 0.65);
      overflow: hidden;
    }

    .iss-weekly-header,
    .iss-weekly-row {
      display: grid;
      grid-template-columns:
        minmax(0, 1.9fr)
        repeat(5, minmax(0, 1fr));
      align-items: stretch;
      width: 100%;
      box-sizing: border-box;
    }

    .iss-weekly-header {
      font-weight: 600;
      color: #f9fafb;
      background:
        radial-gradient(
          600px 400px at 0% 0%,
          rgba(34, 197, 94, 0.35),
          transparent 60%
        ),
        linear-gradient(
          to right,
          rgba(15, 23, 42, 0.98),
          rgba(15, 23, 42, 0.93)
        );
      border-bottom: 1px solid rgba(15, 23, 42, 0.95);
    }

    .iss-weekly-header .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.18rem 0.25rem;
      white-space: nowrap;
      font-size: 0.72rem;
      border-right: 1px solid rgba(15, 23, 42, 0.95);
    }

    .iss-weekly-header .cell:last-child {
      border-right: none;
    }

    .iss-weekly-row {
      background: #020617;
      border-bottom: 1px solid rgba(15, 23, 42, 0.95);
    }

    .iss-weekly-row:last-child {
      border-bottom: none;
    }

    .iss-weekly-row .cell {
      display: flex;
      align-items: stretch;
      justify-content: stretch;
      padding: 0;
      box-sizing: border-box;
      min-width: 0;
      border-right: 1px solid rgba(15, 23, 42, 0.95);
    }

    .iss-weekly-row .cell:last-child {
      border-right: none;
    }

    .iss-weekly .cell.area {
      text-align: left;
    }

    .iss-weekly .cell.day {
      text-align: center;
    }

    .iss-weekly-header .cell,
    .iss-weekly-row .cell {
      background-color: rgba(15, 23, 42, 0.97);
    }

    .label-in,
    .day-in {
      width: 100%;
      border-radius: 0;
      border: none;
      padding: 0.16rem 0.26rem;
      font-size: 0.75rem;
      font-weight: 500;
      background: transparent;
      color: #e5e7eb;
      box-sizing: border-box;
      min-width: 0;

      border-bottom: 1px solid transparent;
    }

    .label-in {
      text-align: left;
    }

    .day-in {
      text-align: center;
    }

    .label-in[readonly] {
      opacity: 0.9;
    }

    .day-in::placeholder {
      color: #6b7280;
    }

    .day-in:focus,
    .label-in:focus {
      outline: none;
      border-bottom-color: #22c55e;
      box-shadow: inset 0 -1px 0 rgba(34, 197, 94, 0.9);
    }

    .center {
      text-align: center;
    }

    .iss-weekly--mobile {
      overflow-x: visible;
    }

    .iss-weekly--mobile .iss-weekly-header {
      display: none;
    }

    .iss-weekly--mobile .iss-weekly-row {
      display: flex;
      flex-direction: column;
      min-width: 0;
      border-bottom: 1px solid rgba(15, 23, 42, 0.95);
      background: #020617;
    }

    .iss-weekly--mobile .iss-weekly-row .cell {
      border-right: none;
      border-bottom: 1px solid rgba(15, 23, 42, 0.8);
      padding: 0.35rem 0.45rem;
      background-color: transparent;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .iss-weekly--mobile .iss-weekly-row .cell:last-child {
      border-bottom: none;
    }

    .iss-weekly--mobile .iss-weekly-row .cell::before {
      display: block;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #9ca3af;
      margin-bottom: 0.1rem;
    }

    .iss-weekly--mobile .iss-weekly-row .cell:nth-child(1)::before { content: 'Area'; }
    .iss-weekly--mobile .iss-weekly-row .cell:nth-child(2)::before { content: 'Mon'; }
    .iss-weekly--mobile .iss-weekly-row .cell:nth-child(3)::before { content: 'Tue'; }
    .iss-weekly--mobile .iss-weekly-row .cell:nth-child(4)::before { content: 'Wed'; }
    .iss-weekly--mobile .iss-weekly-row .cell:nth-child(5)::before { content: 'Thu'; }
    .iss-weekly--mobile .iss-weekly-row .cell:nth-child(6)::before { content: 'Fri'; }

    .iss-weekly--mobile .label-in,
    .iss-weekly--mobile .day-in {
      background: #020617;
      padding: 0.28rem 0.4rem;
      font-size: 0.85rem;
      text-align: left;
    }

    @media print {
      .iss-weekly {
        box-shadow: none;
        background: #ffffff;
        border-color: #000;
      }
      .iss-weekly-header .cell,
      .iss-weekly-row .cell {
        background: #ffffff;
        color: #000000;
      }
      .label-in,
      .day-in {
        color: #000000;
      }
    }
  `],
})
export class IssWeeklyInitialsSectionComponent {
  @Input({ required: true }) legend!: string;
  @Input({ required: true }) rows!: FormArray<FormGroup>;
  @Input() mobile = false;

  trackByIndex(index: number): number {
    return index;
  }
}
