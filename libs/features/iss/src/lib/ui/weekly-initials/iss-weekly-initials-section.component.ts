import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-iss-weekly-initials-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <fieldset class="iss-weekly-fieldset">
      <legend>{{ legend }}</legend>

      <div class="iss-weekly">
        <!-- Header row (desktop / medium screens) -->
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
          *ngFor="let _ of rows.controls; let i = index"
          [formGroup]="rowGroup(i)"
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
  styles: [
    `
      /* Tight fieldset around the weekly grid */
      .iss-weekly-fieldset {
        padding: 0.6rem 0.7rem;
        margin-bottom: 0.5rem;
        border: none;
      }

      .iss-weekly-fieldset > legend {
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 0 0.35rem;
        margin-left: 0.15rem;
        margin-bottom: 0.2rem;
        color: #111827;
      }

      /* Outer box */
      .iss-weekly {
        border: 1px solid #d1d5db;
        background: #ffffff;
        font-size: 0.8rem;
        width: 100%;
        box-sizing: border-box;
        overflow-x: auto;
        color: #111827;
        border-radius: 0.35rem;
      }

      /* DESKTOP / DEFAULT: table-like row
         Area | Mon | Tue | Wed | Thu | Fri
      */
      .iss-weekly-header,
      .iss-weekly-row {
        display: grid;
        grid-template-columns: 2fr repeat(5, 1fr);
        align-items: stretch;
        min-width: 600px; /* allows scroll on narrow but keeps nice proportions */
      }

      /* Generic cell: softer vertical separators */
      .iss-weekly .cell {
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        padding: 0;
        border-right: 1px solid #e5e7eb;
        box-sizing: border-box;
      }

      .iss-weekly-header .cell:last-child,
      .iss-weekly-row .cell:last-child {
        border-right: none;
      }

      /* Header styling */
      .iss-weekly-header {
        border-bottom: 1px solid #d1d5db;
        font-weight: 600;
        color: #111827;
        background-color: #f3f4f6;
      }

      .iss-weekly-header .cell {
        align-items: center;
        justify-content: center;
        padding: 0.18rem 0.3rem;
      }

      /* Data rows baseline */
      .iss-weekly-row {
        border-bottom: 1px solid #e5e7eb;
      }

      .iss-weekly-row:last-child {
        border-bottom: none;
      }

      /* Column layout: wide Area + 5 equal day columns */
      .iss-weekly .cell.area {
        text-align: left;
      }

      .iss-weekly .cell.day {
        text-align: center;
      }

      /* Checkerboard columns on larger screens */
      .iss-weekly-header .cell:nth-child(even),
      .iss-weekly-row .cell:nth-child(even) {
        background-color: #f9fafb; /* light gray */
      }

      .iss-weekly-header .cell:nth-child(odd),
      .iss-weekly-row .cell:nth-child(odd) {
        background-color: #ffffff;
      }

      /* Area label input */
      .label-in {
        width: 100%;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid #9ca3af;
        padding: 0.12rem 0.3rem;
        font-size: 0.8rem;
        font-weight: 500;
        background: transparent;
        color: #111827;
        box-sizing: border-box;
      }

      /* Day initials inputs */
      .day-in {
        width: 100%;
        max-width: 100%;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid #9ca3af;
        padding: 0.12rem 0.22rem;
        font-size: 0.8rem;
        font-weight: 500;
        background: transparent;
        color: #111827;
        box-sizing: border-box;
        text-align: center;
      }

      .day-in::placeholder {
        color: #6b7280;
      }

      .center {
        text-align: center;
      }

      /* ==========================================
         RESPONSIVE: small screens / phones
         ========================================== */
      @media (max-width: 640px) {
        /* Let it shrink instead of forcing horizontal scroll */
        .iss-weekly {
          overflow-x: visible;
        }

        /* Hide the big header row; we'll show labels per cell instead */
        .iss-weekly-header {
          display: none;
        }

        /* Each data row becomes a vertical stack */
        .iss-weekly-row {
          display: flex;
          flex-direction: column;
          min-width: 0;
          border-bottom: 1px solid #e5e7eb;
        }

        /* Cells become full-width rows with their own label */
        .iss-weekly .cell {
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
          padding: 0.15rem 0.3rem;
          background-color: #ffffff; /* remove checkerboard on mobile for clarity */
        }

        .iss-weekly-row .cell:last-child {
          border-bottom: none;
        }

        /* Add labels via CSS so you still know which field is which */
        .iss-weekly-row .cell::before {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7280;
          margin-bottom: 0.1rem;
        }

        .iss-weekly-row .cell:nth-child(1)::before {
          content: 'Area';
        }
        .iss-weekly-row .cell:nth-child(2)::before {
          content: 'Mon';
        }
        .iss-weekly-row .cell:nth-child(3)::before {
          content: 'Tue';
        }
        .iss-weekly-row .cell:nth-child(4)::before {
          content: 'Wed';
        }
        .iss-weekly-row .cell:nth-child(5)::before {
          content: 'Thu';
        }
        .iss-weekly-row .cell:nth-child(6)::before {
          content: 'Fri';
        }

        /* Inputs on mobile: solid white boxes for readability */
        .label-in,
        .day-in {
          background: #ffffff;
          border-bottom: 1px solid #9ca3af;
        }
      }
    `,
  ],
})
export class IssWeeklyInitialsSectionComponent {
  @Input({ required: true }) legend!: string;
  @Input({ required: true }) rows!: FormArray<FormGroup>;

  rowGroup(index: number): FormGroup {
    return this.rows.at(index) as FormGroup;
  }
}
