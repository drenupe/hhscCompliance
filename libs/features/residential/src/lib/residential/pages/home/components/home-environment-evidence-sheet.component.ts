import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CreateHomeEnvironmentEvidenceInput,
  HomeEnvironmentEvidenceType,
  HomeEnvironmentRuleCode,
} from '@hhsc-compliance/shared-models';

@Component({
  standalone: true,
  selector: 'lib-home-environment-evidence-sheet',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
   <button
  class="backdrop"
  type="button"
  aria-label="Close evidence sheet"
  (click)="closed.emit()"
>
  <span class="sr-only">Close evidence sheet</span>
</button>

    <aside class="sheet">
      <div class="head">
        <div>
          <h3>Add Evidence</h3>
          <div class="subtle">{{ ruleCode }}</div>
        </div>
        <button type="button" (click)="closed.emit()">Close</button>
      </div>

      <form class="body" [formGroup]="form" (ngSubmit)="submit()">
        <label>
          Type
          <select formControlName="type">
            <option value="NOTE">NOTE</option>
            <option value="PHOTO">PHOTO</option>
            <option value="DOCUMENT">DOCUMENT</option>
            <option value="CHECKLIST">CHECKLIST</option>
            <option value="INSPECTION_LOG">INSPECTION_LOG</option>
          </select>
        </label>

        <label>
          Title
          <input type="text" formControlName="title" />
        </label>

        <label>
          Note
          <textarea formControlName="note"></textarea>
        </label>

        <label>
          File name
          <input type="text" formControlName="fileName" />
        </label>

        <label>
          File URL
          <input type="text" formControlName="fileUrl" />
        </label>

        <div class="actions">
          <button type="button" (click)="closed.emit()">Cancel</button>
          <button type="submit" [disabled]="form.invalid">Save Evidence</button>
        </div>
      </form>
    </aside>
  `,
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.45);
      border: 0;
      z-index: 60;
    }

    .sheet {
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: min(560px, 100vw);
      background: #fff;
      border-left: 1px solid #e5e7eb;
      z-index: 61;
      display: grid;
      grid-template-rows: auto 1fr;
    }

    .head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .subtle {
      font-size: 12px;
      color: #6b7280;
    }

    .body {
      overflow: auto;
      padding: 16px;
      display: grid;
      gap: 12px;
    }

    label {
      display: grid;
      gap: 6px;
      font-size: 12px;
      color: #6b7280;
    }

    input, textarea, select {
      border: 1px solid #d1d5db;
      border-radius: 10px;
      padding: 10px 12px;
    }

    textarea {
      min-height: 120px;
      resize: vertical;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
  `],
})
export class HomeEnvironmentEvidenceSheetComponent {
  @Input({ required: true }) locationId!: string;
  @Input({ required: true }) ruleCode!: HomeEnvironmentRuleCode;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<CreateHomeEnvironmentEvidenceInput>();

  readonly form = new FormGroup({
    type: new FormControl<HomeEnvironmentEvidenceType>('NOTE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    note: new FormControl<string | null>(null),
    fileName: new FormControl<string | null>(null),
    fileUrl: new FormControl<string | null>(null),
  });

  submit(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    this.submitted.emit({
      locationId: this.locationId,
      ruleCode: this.ruleCode,
      type: v.type,
      title: v.title.trim(),
      note: v.note?.trim() || null,
      fileName: v.fileName?.trim() || null,
      fileUrl: v.fileUrl?.trim() || null,
    });
  }
}