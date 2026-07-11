import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  CsvParserService,
  ImportMapperService,
  ProcessEngineService,
  ProcessStateService,
} from '@hhsc-compliance/data-access';

import { ImportTemplate } from '@hhsc-compliance/shared-models';

import {
  WorkflowShellComponent,
  WorkspaceComponent,
} from '@hhsc-compliance/ui-kit';

import { AGENCY_CREATION_WORKFLOW } from '../../workflows/agency-creation.workflow';

@Component({
  selector: 'lib-csv-import-wizard',
  standalone: true,
  imports: [
    CommonModule,
    WorkflowShellComponent,
    WorkspaceComponent,
  ],
  templateUrl: './csv-import-wizard.component.html',
  styleUrls: ['./csv-import-wizard.component.scss'],
})
export class CsvImportWizardComponent {
  private readonly router = inject(Router);
  private readonly processEngine = inject(ProcessEngineService);
  private readonly processState = inject(ProcessStateService);
  private readonly csvParser = inject(CsvParserService);
  private readonly importMapper = inject(ImportMapperService);

  readonly workflow = AGENCY_CREATION_WORKFLOW;
  readonly currentStepId = 'import';
  readonly steps = this.workflow.steps;

  readonly processing = signal(false);
  readonly error = signal('');
  readonly uploadMessage = signal('');

  templates: ImportTemplate[] = [
    {
      id: 'provider',
      name: 'Provider Information',
      description: 'Agency name, provider number, contact details, and administrator information.',
      requirement: 'required',
      expectedFileName: 'provider.csv',
      status: 'not-started',
      uploaded: false,
      headers: [
        'agency_name',
        'provider_number',
        'license_number',
        'administrator_name',
        'phone',
        'email',
        'address',
        'city',
        'state',
        'zip',
      ],
      sampleRow: {
        agency_name: 'ABC Residential Services',
        provider_number: '123456',
        license_number: 'HCS-123456',
        administrator_name: 'Jane Smith',
        phone: '214-555-0100',
        email: 'admin@example.com',
        address: '123 Main St',
        city: 'Dallas',
        state: 'TX',
        zip: '75201',
      },
    },
    {
      id: 'employees',
      name: 'Employees',
      description: 'Staff names, job titles, hire dates, phone numbers, and employment status.',
      requirement: 'required',
      expectedFileName: 'employees.csv',
      status: 'not-started',
      uploaded: false,
      headers: [
        'employee_id',
        'first_name',
        'last_name',
        'job_title',
        'hire_date',
        'phone',
        'email',
        'status',
        'assigned_location_id',
      ],
      sampleRow: {
        employee_id: 'EMP-001',
        first_name: 'Maria',
        last_name: 'Johnson',
        job_title: 'Direct Support Professional',
        hire_date: '2026-01-15',
        phone: '214-555-0101',
        email: 'maria@example.com',
        status: 'active',
        assigned_location_id: 'LOC-001',
      },
    },
    {
      id: 'consumers',
      name: 'Consumers',
      description: 'Consumer demographics, Medicaid numbers, assigned homes, and case manager links.',
      requirement: 'required',
      expectedFileName: 'consumers.csv',
      status: 'not-started',
      uploaded: false,
      headers: [
        'consumer_id',
        'first_name',
        'last_name',
        'medicaid_number',
        'date_of_birth',
        'assigned_location_id',
        'case_manager_name',
        'level_of_need',
      ],
      sampleRow: {
        consumer_id: 'CON-001',
        first_name: 'James',
        last_name: 'Harris',
        medicaid_number: 'MCD123456',
        date_of_birth: '1985-06-10',
        assigned_location_id: 'LOC-001',
        case_manager_name: 'Sarah Adams',
        level_of_need: 'LON 5',
      },
    },
    {
      id: 'locations',
      name: 'Residential Locations',
      description: 'Group homes, host homes, addresses, location codes, and capacity details.',
      requirement: 'required',
      expectedFileName: 'locations.csv',
      status: 'not-started',
      uploaded: false,
      headers: [
        'location_id',
        'location_name',
        'location_type',
        'address',
        'city',
        'state',
        'zip',
        'capacity',
      ],
      sampleRow: {
        location_id: 'LOC-001',
        location_name: 'Main Street Home',
        location_type: 'Four Person Home',
        address: '456 Main St',
        city: 'Dallas',
        state: 'TX',
        zip: '75216',
        capacity: '4',
      },
    },
    {
      id: 'training',
      name: 'Training Records',
      description: 'Employee training history, completion dates, and expiration dates.',
      requirement: 'recommended',
      expectedFileName: 'training.csv',
      status: 'not-started',
      uploaded: false,
      headers: [
        'employee_id',
        'training_name',
        'completion_date',
        'expiration_date',
        'trainer',
      ],
      sampleRow: {
        employee_id: 'EMP-001',
        training_name: 'Abuse Neglect Exploitation',
        completion_date: '2026-01-20',
        expiration_date: '2027-01-20',
        trainer: 'Jane Smith',
      },
    },
    {
      id: 'authorizations',
      name: 'Authorizations',
      description: 'Service authorizations, IPC dates, levels, and approval periods.',
      requirement: 'recommended',
      expectedFileName: 'authorizations.csv',
      status: 'not-started',
      uploaded: false,
      headers: [
        'consumer_id',
        'service_code',
        'service_name',
        'start_date',
        'end_date',
        'authorized_units',
      ],
      sampleRow: {
        consumer_id: 'CON-001',
        service_code: 'HCS',
        service_name: 'Supported Home Living',
        start_date: '2026-01-01',
        end_date: '2026-12-31',
        authorized_units: '365',
      },
    },
  ];

  constructor() {
    this.processEngine.updateTemplates(this.templates);
  }

  get requiredTemplates(): ImportTemplate[] {
    return this.templates.filter((template) => template.requirement === 'required');
  }

  get recommendedTemplates(): ImportTemplate[] {
    return this.templates.filter((template) => template.requirement !== 'required');
  }

  get uploadedCount(): number {
    return this.templates.filter((template) => template.uploaded).length;
  }

  get totalCount(): number {
    return this.templates.length;
  }

  get uploadPercent(): number {
    return this.totalCount === 0
      ? 0
      : Math.round((this.uploadedCount / this.totalCount) * 100);
  }

  get requiredCount(): number {
    return this.requiredTemplates.length;
  }

  get recommendedCount(): number {
    return this.recommendedTemplates.length;
  }

  get requiredUploadedCount(): number {
    return this.requiredTemplates.filter((template) => template.uploaded).length;
  }

  get recommendedUploadedCount(): number {
    return this.recommendedTemplates.filter((template) => template.uploaded).length;
  }

  get canContinue(): boolean {
    return this.requiredTemplates.every((template) => template.uploaded);
  }

  downloadAllTemplates(): void {
    for (const template of this.templates) {
      this.downloadTemplate(template);
    }
  }

  downloadTemplate(template: ImportTemplate): void {
    const headers = template.headers ?? ['id', 'name'];
    const sampleRow = template.sampleRow ?? {};

    const rows = [
      headers.join(','),
      headers
        .map((header) => this.escapeCsvValue(sampleRow[header] ?? ''))
        .join(','),
    ];

    const blob = new Blob([rows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = template.expectedFileName;
    link.click();

    URL.revokeObjectURL(url);
  }

  async uploadMultipleTemplates(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (!files.length) {
      return;
    }

    this.processing.set(true);
    this.error.set('');
    this.uploadMessage.set('');

    const unmatchedFiles: string[] = [];
    let processedCount = 0;

    try {
      for (const file of files) {
        const matchedTemplate = this.findTemplateForFile(file);

        if (!matchedTemplate) {
          unmatchedFiles.push(file.name);
          continue;
        }

        const parsed = await this.csvParser.parse(file);

        const mappedTable = this.importMapper.map(matchedTemplate.id, parsed);

        this.processState.addMappedTable(mappedTable);

        this.templates = this.templates.map((template) =>
          template.id === matchedTemplate.id
            ? {
              ...template,
              uploaded: true,
              status: 'uploaded',
              recordsFound: parsed.rowCount,
            }
            : template,
        );

        processedCount += 1;
      }


      this.processEngine.updateTemplates(this.templates);

      if (this.canContinue) {
        this.processing.set(true);

        this.processEngine.validate();

        setTimeout(() => {
          this.processing.set(false);

          this.router.navigate([
            '/provider-onboarding/agency-creation/validation',
          ]);
        }, 300);

        return;
      }

      if (processedCount > 0) {
        this.uploadMessage.set(
          `${processedCount} file${processedCount === 1 ? '' : 's'} processed successfully.`,
        );
      }

      if (unmatchedFiles.length) {
        this.error.set(
          `These files were not matched: ${unmatchedFiles.join(', ')}. Please use the expected template filenames.`,
        );
      }
    } catch {
      this.error.set(
        'One or more CSV files could not be read. Please check the files and try again.',
      );
    } finally {
      this.processing.set(false);
      input.value = '';
    }
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

    this.processEngine.updateTemplates(this.templates);
  }

  goBack(): void {
    this.router.navigate(['/provider-onboarding/agency-creation']);
  }

  continueToValidation(): void {
    if (!this.canContinue) {
      return;
    }

    this.processEngine.validate();

    this.router.navigate(['/provider-onboarding/agency-creation/validation']);
  }

  private findTemplateForFile(file: File): ImportTemplate | undefined {
    const fileName = file.name.toLowerCase().trim();

    return this.templates.find(
      (template) => template.expectedFileName.toLowerCase() === fileName,
    );
  }

  private escapeCsvValue(value: unknown): string {
    const stringValue = String(value ?? '');
    const needsQuotes =
      stringValue.includes(',') ||
      stringValue.includes('"') ||
      stringValue.includes('\n');

    const escaped = stringValue.replace(/"/g, '""');

    return needsQuotes ? `"${escaped}"` : escaped;
  }
}