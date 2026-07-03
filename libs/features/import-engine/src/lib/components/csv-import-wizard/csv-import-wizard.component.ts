import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ImportTemplate } from '@hhsc-compliance/shared-models';

import { CsvUploadCardComponent } from '../csv-upload-card/csv-upload-card.component';

@Component({
  selector: 'lib-csv-import-wizard',
  standalone: true,
  imports: [CommonModule, CsvUploadCardComponent],
  templateUrl: './csv-import-wizard.component.html',
  styleUrls: ['./csv-import-wizard.component.scss'],
})
export class CsvImportWizardComponent {
  private readonly router = inject(Router);

  templates: ImportTemplate[] = [
    {
      id: 'provider',
      name: 'Provider Information',
      description:
        'Agency name, provider number, contact details, and administrator information.',
      requirement: 'required',
      expectedFileName: 'provider.csv',
      status: 'uploaded',
      uploaded: true,
      recordsFound: 1,
    },
    {
      id: 'employees',
      name: 'Employees',
      description:
        'Staff names, job titles, hire dates, phone numbers, and employment status.',
      requirement: 'required',
      expectedFileName: 'employees.csv',
      status: 'uploaded',
      uploaded: true,
      recordsFound: 184,
    },
    {
      id: 'consumers',
      name: 'Consumers',
      description:
        'Consumer demographics, Medicaid numbers, assigned homes, and case manager links.',
      requirement: 'required',
      expectedFileName: 'consumers.csv',
      status: 'uploaded',
      uploaded: true,
      recordsFound: 72,
    },
    {
      id: 'locations',
      name: 'Residential Locations',
      description:
        'Group homes, host homes, addresses, location codes, and capacity details.',
      requirement: 'required',
      expectedFileName: 'locations.csv',
      status: 'uploaded',
      uploaded: true,
      recordsFound: 8,
    },
    {
      id: 'training',
      name: 'Training Records',
      description:
        'Employee training history, completion dates, and expiration dates.',
      requirement: 'recommended',
      expectedFileName: 'training.csv',
      status: 'not-started',
      uploaded: false,
    },
    {
      id: 'authorizations',
      name: 'Authorizations',
      description:
        'Service authorizations, IPC dates, levels, and approval periods.',
      requirement: 'recommended',
      expectedFileName: 'authorizations.csv',
      status: 'not-started',
      uploaded: false,
    },
  ];

  get uploadedCount(): number {
    return this.templates.filter((template) => template.uploaded).length;
  }

  get totalCount(): number {
    return this.templates.length;
  }

  get uploadPercent(): number {
    if (this.totalCount === 0) {
      return 0;
    }

    return Math.round((this.uploadedCount / this.totalCount) * 100);
  }

  get canContinue(): boolean {
    return this.templates
      .filter((template) => template.requirement === 'required')
      .every((template) => template.uploaded);
  }

  uploadTemplate(template: ImportTemplate): void {
    this.templates = this.templates.map((item) =>
      item.id === template.id
        ? {
            ...item,
            uploaded: true,
            status: 'uploaded',
            recordsFound: item.recordsFound ?? 1,
          }
        : item,
    );
  }

  removeTemplate(template: ImportTemplate): void {
    this.templates = this.templates.map((item) =>
      item.id === template.id
        ? {
            ...item,
            uploaded: false,
            status: 'not-started',
            recordsFound: undefined,
          }
        : item,
    );
  }

  goBack(): void {
    this.router.navigate(['/provider-onboarding/agency-creation']);
  }

  continueToValidation(): void {
    if (!this.canContinue) {
      return;
    }

    this.router.navigate(['/provider-onboarding/agency-creation/validation']);
  }
}