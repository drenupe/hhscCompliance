import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { IssWeeklyInitialsSectionComponent } from '../ui/weekly-initials/iss-weekly-initials-section.component';

@Component({
  selector: 'lib-iss-staff-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IssWeeklyInitialsSectionComponent,
  ],
  templateUrl: './iss-staff.page.html',
  styleUrls: ['./iss-staff.page.scss'],
})
export class IssStaffPage {
  // Prefer inject() over constructor injection
  private readonly fb = inject(FormBuilder);

  // Form built via fb + inject()
  readonly form: FormGroup = this.fb.group({
    header: this.fb.group({
      individualName: ['James Harris'],
      date: [new Date().toISOString().slice(0, 10)],
      lon: [''],
      provider: [''],
      license: [''],
      staffNameTitle: ['ISS Direct Care Staff'],
    }),

    // Monday–Friday line items
    serviceWeek: this.fb.array([
      this.buildServiceRow('Monday'),
      this.buildServiceRow('Tuesday'),
      this.buildServiceRow('Wednesday'),
      this.buildServiceRow('Thursday'),
      this.buildServiceRow('Friday'),
    ]),

    // Weekly initials sections
    socialization: this.fb.array([
      this.buildWeeklyRow('Communication'),
      this.buildWeeklyRow('Socialization Skills Development'),
      this.buildWeeklyRow('Group Activity'),
      this.buildWeeklyRow('Volunteer or Employment Skills Development'),
      this.buildWeeklyRow('Transportation'),
    ]),
    selfHelp: this.fb.array([
      this.buildWeeklyRow('Personal Hygiene'),
      this.buildWeeklyRow('Eating'),
      this.buildWeeklyRow('Meal Preparation'),
      this.buildWeeklyRow('Cleaning'),
      this.buildWeeklyRow('Assistance with Medication'),
    ]),
    adaptive: this.fb.array([
      this.buildWeeklyRow('Ambulation and Mobility'),
      this.buildWeeklyRow('Reinforce Lessons'),
      
    ]),
    implementation: this.fb.array([
      this.buildWeeklyRow('Other:'),
      this.buildWeeklyRow('Other:'),
    ]),
    community: this.fb.array([
      this.buildWeeklyRow('Community Location (describe location(s) in the comments)'),
      this.buildWeeklyRow('Transportation'),
    ]),

    // Notes rows: minimum 5 (one for each day of service)
    notes: this.fb.array(
      Array.from({ length: 5 }, () => this.buildNoteRow())
    ),
  });


  // ------- builders -------

  private buildServiceRow(day: string): FormGroup {
    return this.fb.group({
      day: [day],
      date: [''],
      providerName: [''],
      providerSignature: [''],
      start: [''],
      end: [''],
      minutes: [0],
      setting: ['on_site'], // 'on_site' | 'off_site'
      individualsCount: [0],
      staffCount: [1],
    });
  }

  private buildWeeklyRow(label: string): FormGroup {
    return this.fb.group({
      label: [label],
      mon: [''],
      tue: [''],
      wed: [''],
      thu: [''],
      fri: [''],
    });
  }

  private buildNoteRow(): FormGroup {
    return this.fb.group({
      date: [''],
      initials: [''],
      comment: [''],
    });
  }

  // ------- getters used in the template -------

  get serviceWeek(): FormArray<FormGroup> {
    return this.form.get('serviceWeek') as FormArray<FormGroup>;
  }

  get socializationArray(): FormArray<FormGroup> {
    return this.form.get('socialization') as FormArray<FormGroup>;
  }

  get selfHelpArray(): FormArray<FormGroup> {
    return this.form.get('selfHelp') as FormArray<FormGroup>;
  }

  get adaptiveArray(): FormArray<FormGroup> {
    return this.form.get('adaptive') as FormArray<FormGroup>;
  }

  get implementationArray(): FormArray<FormGroup> {
    return this.form.get('implementation') as FormArray<FormGroup>;
  }

  get communityArray(): FormArray<FormGroup> {
    return this.form.get('community') as FormArray<FormGroup>;
  }

  get notes(): FormArray<FormGroup> {
    return this.form.get('notes') as FormArray<FormGroup>;
  }

  // ------- ratio logic (used in template as ratio(i)) -------

  /**
   * For a given row index, compute the Individuals:Staff ratio.
   * If setting is not 'off_site', we return empty / N/A.
   */
  ratio(index: number): string {
    const row = this.serviceWeek.at(index) as FormGroup;
    const setting = row.get('setting')?.value as
      | 'on_site'
      | 'off_site'
      | undefined;

    if (setting !== 'off_site') {
      return '';
    }

    const individuals = Number(row.get('individualsCount')?.value ?? 0);
    const staff = Number(row.get('staffCount')?.value ?? 1);

    if (!staff) return '';
    return `${individuals}:${staff}`;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }   

    console.log('ISS Staff form value', this.form.value);
    // TODO: send to API/store
  }

  // 👇 add this
  onSave(): void {
    this.submit();
  }
}
