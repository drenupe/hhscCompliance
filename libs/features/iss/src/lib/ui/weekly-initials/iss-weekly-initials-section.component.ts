import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-iss-weekly-initials-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <fieldset class="iss-fieldset">
      <legend>{{ legend }}</legend>

      <div class="iss-weekly">
        <!-- Header row -->
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
            <input class="in center" formControlName="mon" />
          </div>
          <div class="cell day">
            <input class="in center" formControlName="tue" />
          </div>
          <div class="cell day">
            <input class="in center" formControlName="wed" />
          </div>
          <div class="cell day">
            <input class="in center" formControlName="thu" />
          </div>
          <div class="cell day">
            <input class="in center" formControlName="fri" />
          </div>
        </div>
      </div>
    </fieldset>
  `,
})
export class IssWeeklyInitialsSectionComponent {
  @Input({ required: true }) legend!: string;
  @Input({ required: true }) rows!: FormArray<FormGroup>;

  rowGroup(index: number): FormGroup {
    return this.rows.at(index) as FormGroup;
  }
}
