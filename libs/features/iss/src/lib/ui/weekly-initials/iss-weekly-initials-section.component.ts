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
        margin-bottom: 0.75rem;
        border: 1px solid var(--clr-line, rgba(148, 163, 184, 0.35));
        border-radius: 0.6rem;
        background: color-mix(
          in srgb,
          var(--surface-card, #020617) 88%,
          #020617 12%
        );
      }

      .iss-weekly-fieldset > legend {
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 0 0.35rem;
        margin-left: 0.15rem;
        margin-bottom: 0.35rem;
        color: var(--clr-muted, #9ca3af);
      }

      /* Outer box */
      .iss-weekly {
        border: 1px solid var(--clr-line, rgba(148, 163, 184, 0.35));
        background: radial-gradient(
            800px 600px at 0% 0%,
            rgba(148, 163, 184, 0.08),
            transparent 50%
          ),
          var(--surface-card, #020617);
        font-size: 0.8rem;
        width: 100%;
        box-sizing: border-box;
        overflow-x: auto;
        color: var(--clr-text, #e5e7eb);
        border-radius: 0.5rem;
        box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.5));
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

      /* Generic cell */
      .iss-weekly .cell {
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        padding: 0;
        border-right: 1px solid rgba(15, 23, 42, 0.9);
        box-sizing: border-box;
      }

      .iss-weekly-header .cell:last-child,
      .iss-weekly-row .cell:last-child {
        border-right: none;
      }

      /* Header styling */
      .iss-weekly-header {
        border-bottom: 1px solid rgba(15, 23, 42, 0.9);
        font-weight: 600;
        color: var(--text-strong, #f9fafb);
        background: linear-gradient(
          to right,
          rgba(15, 23, 42, 0.95),
          rgba(15, 23, 42, 0.9)
        );
      }

      .iss-weekly-header .cell {
        align-items: center;
        justify-content: center;
        padding: 0.18rem 0.3rem;
      }

      /* Data rows baseline */
      .iss-weekly-row {
        border-bottom: 1px solid rgba(15, 23, 42, 0.85);
        background: color-mix(
          in srgb,
          var(--surface-muted, #020617) 88%,
          #020617 12%
        );
      }

      .iss-weekly-row:last-child {
        border-bottom: none;
      }

      /* Column layout */
      .iss-weekly .cell.area {
        text-align: left;
      }

      .iss-weekly .cell.day {
        text-align: center;
      }

      /* Subtle column striping on larger screens */
      .iss-weekly-header .cell:nth-child(even),
      .iss-weekly-row .cell:nth-child(even) {
        background-color: rgba(15, 23, 42, 0.85);
      }

      .iss-weekly-header .cell:nth-child(odd),
      .iss-weekly-row .cell:nth-child(odd) {
        background-color: rgba(15, 23, 42, 0.92);
      }

      /* Area label input */
      .label-in {
        width: 100%;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid rgba(148, 163, 184, 0.7);
        padding: 0.16rem 0.36rem;
        font-size: 0.8rem;
        font-weight: 500;
        background: transparent;
        color: var(--clr-text, #e5e7eb);
        box-sizing: border-box;
      }

      .label-in[readonly] {
        opacity: 0.9;
      }

      /* Day initials inputs */
      .day-in {
        width: 100%;
        max-width: 100%;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid rgba(148, 163, 184, 0.7);
        padding: 0.16rem 0.26rem;
        font-size: 0.8rem;
        font-weight: 500;
        background: transparent;
        color: var(--clr-text, #e5e7eb);
        box-sizing: border-box;
        text-align: center;
      }

      .day-in::placeholder {
        color: var(--clr-muted, #6b7280);
      }

      .day-in:focus,
      .label-in:focus {
        outline: none;
        box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.6);
        border-bottom-color: rgba(129, 140, 248, 0.9);
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
          border-bottom: 1px solid rgba(15, 23, 42, 0.9);
          background: color-mix(
            in srgb,
            var(--surface-card, #020617) 90%,
            #020617 10%
          );
        }

        /* Cells become full-width rows with their own label */
        .iss-weekly .cell {
          border-right: none;
          border-bottom: 1px solid rgba(15, 23, 42, 0.85);
          padding: 0.2rem 0.35rem;
          background-color: transparent;
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
          color: var(--clr-muted, #9ca3af);
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

        /* Inputs on mobile: slightly more solid for readability */
        .label-in,
        .day-in {
          background: rgba(15, 23, 42, 0.8);
          border-bottom-color: rgba(148, 163, 184, 0.9);
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
