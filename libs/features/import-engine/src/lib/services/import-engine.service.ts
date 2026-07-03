import { Injectable, signal } from '@angular/core';

import {
  ImportSummary,
  ImportTemplate,
  ImportValidationResult,
} from '@hhsc-compliance/shared-models';

@Injectable({
  providedIn: 'root',
})
export class ImportEngineService {
  private readonly templatesState = signal<ImportTemplate[]>([
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
      status: 'warning',
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
      status: 'ready',
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
      status: 'ready',
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
      status: 'warning',
      uploaded: true,
      recordsFound: 1842,
    },
    {
      id: 'authorizations',
      name: 'Authorizations',
      description:
        'Service authorizations, IPC dates, levels, and approval periods.',
      requirement: 'recommended',
      expectedFileName: 'authorizations.csv',
      status: 'error',
      uploaded: true,
      recordsFound: 144,
    },
  ]);

  private readonly validationResultsState = signal<ImportValidationResult[]>([
    {
      templateId: 'provider',
      templateName: 'Provider Information',
      totalRecords: 1,
      validRecords: 1,
      warningCount: 0,
      errorCount: 0,
      issues: [],
    },
    {
      templateId: 'employees',
      templateName: 'Employees',
      totalRecords: 184,
      validRecords: 181,
      warningCount: 3,
      errorCount: 0,
      issues: [
        {
          id: 'employee-rn-license',
          templateId: 'employees',
          title: 'RN license needs verification',
          description:
            'Three employee records reference nursing credentials that need license verification.',
          severity: 'warning',
          affectedRows: [12, 44, 91],
          recommendedAction: 'Review RN license numbers before final import.',
        },
      ],
    },
    {
      templateId: 'consumers',
      templateName: 'Consumers',
      totalRecords: 72,
      validRecords: 72,
      warningCount: 0,
      errorCount: 0,
      issues: [],
    },
    {
      templateId: 'locations',
      templateName: 'Residential Locations',
      totalRecords: 8,
      validRecords: 8,
      warningCount: 0,
      errorCount: 0,
      issues: [],
    },
    {
      templateId: 'training',
      templateName: 'Training Records',
      totalRecords: 1842,
      validRecords: 1826,
      warningCount: 16,
      errorCount: 0,
      issues: [
        {
          id: 'training-expiration-dates',
          templateId: 'training',
          title: 'Missing expiration dates',
          description:
            'Some training records are missing expiration dates and may require review.',
          severity: 'warning',
          affectedRows: [22, 87, 203, 311],
          recommendedAction:
            'Confirm expiration dates for required annual training.',
        },
      ],
    },
    {
      templateId: 'authorizations',
      templateName: 'Authorizations',
      totalRecords: 144,
      validRecords: 142,
      warningCount: 0,
      errorCount: 2,
      issues: [
        {
          id: 'authorization-date-range',
          templateId: 'authorizations',
          title: 'Invalid authorization date ranges',
          description:
            'Two authorization records have end dates before start dates.',
          severity: 'error',
          affectedRows: [19, 88],
          recommendedAction:
            'Correct authorization date ranges before building the agency.',
        },
      ],
    },
  ]);

  readonly templates = this.templatesState.asReadonly();
  readonly validationResults = this.validationResultsState.asReadonly();

  getSummary(): ImportSummary {
    const results = this.validationResultsState();

    return {
      totalFilesUploaded: this.templatesState().filter((item) => item.uploaded)
        .length,
      totalRecordsReady: results.reduce(
        (total, item) => total + item.validRecords,
        0,
      ),
      totalWarnings: results.reduce(
        (total, item) => total + item.warningCount,
        0,
      ),
      totalErrors: results.reduce((total, item) => total + item.errorCount, 0),
      readinessPercent: 85,
      items: results.map((item) => ({
        templateId: item.templateId,
        label: item.templateName,
        recordsReady: item.validRecords,
        warnings: item.warningCount,
        errors: item.errorCount,
      })),
    };
  }
}