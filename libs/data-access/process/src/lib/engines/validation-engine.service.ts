import { Injectable } from '@angular/core';

import {
  ImportTemplate,
  MappedImportTable,
  OnboardingReadiness,
  OnboardingReadinessCategory,
} from '@hhsc-compliance/shared-models';

interface ValidationCounts {
  errors: number;
  warnings: number;
}

@Injectable({
  providedIn: 'root',
})
export class ValidationEngineService {
  evaluate(
    templates: ImportTemplate[],
    mappedTables: MappedImportTable[] = [],
  ): OnboardingReadiness {
    const categories: OnboardingReadinessCategory[] = templates.map(
      (template) => {
        const table = mappedTables.find((item) => item.id === template.id);

        let errors = template.uploaded
          ? 0
          : template.requirement === 'required'
            ? 1
            : 0;

        let warnings =
          template.requirement === 'recommended' && !template.uploaded ? 1 : 0;

        if (template.uploaded && table) {
          const result = this.validateTable(template.id, table.records);

          errors += result.errors;
          warnings += result.warnings;
        }

        const score = this.calculateScore(
          template.requirement,
          errors,
          warnings,
        );

        return {
          id: template.id,
          label: template.name,
          score,
          errors,
          warnings,
          complete: errors === 0,
        };
      },
    );

    const errors = categories.reduce(
      (total, category) => total + category.errors,
      0,
    );

    const warnings = categories.reduce(
      (total, category) => total + category.warnings,
      0,
    );

    const overallScore =
      categories.length === 0
        ? 0
        : Math.round(
          categories.reduce((total, category) => total + category.score, 0) /
          categories.length,
        );

    return {
      overallScore,
      readyToBuild: errors === 0,
      errors,
      warnings,
      categories,
    };
  }

  private validateTable(
    templateId: string,
    records: Record<string, string>[],
  ): ValidationCounts {
    switch (templateId) {
      case 'provider':
        return this.validateProvider(records);

      case 'employees':
        return this.validateEmployees(records);

      case 'consumers':
        return this.validateConsumers(records);

      case 'locations':
        return this.validateLocations(records);

      case 'training':
        return this.validateTraining(records);

      case 'authorizations':
        return this.validateAuthorizations(records);

      default:
        return { errors: 0, warnings: 0 };
    }
  }

  private validateProvider(records: Record<string, string>[]): ValidationCounts {
    let errors = 0;
    let warnings = 0;

    if (!records.length) {
      return { errors: 1, warnings: 0 };
    }

    const provider = records[0];

    if (!this.hasValue(provider['agency_name'])) {
      errors += 1;
    }

    if (!this.hasValue(provider['provider_number'])) {
      errors += 1;
    }

    if (!this.hasValue(provider['license_number'])) {
      errors += 1;
    }

    if (!this.hasValue(provider['administrator_name'])) {
      warnings += 1;
    }

    if (!this.hasValue(provider['phone'])) {
      warnings += 1;
    }

    if (!this.hasValue(provider['email'])) {
      warnings += 1;
    }

    if (!this.hasValue(provider['address'])) {
      warnings += 1;
    }

    return { errors, warnings };
  }

  private validateEmployees(records: Record<string, string>[]): ValidationCounts {
    let errors = 0;
    let warnings = 0;
    const employeeIds = new Set<string>();

    for (const record of records) {
      const employeeId = this.clean(record['employee_id']);

      if (!this.hasValue(employeeId)) {
        errors += 1;
      } else if (employeeIds.has(employeeId)) {
        errors += 1;
      } else {
        employeeIds.add(employeeId);
      }

      if (!this.hasValue(record['first_name'])) {
        errors += 1;
      }

      if (!this.hasValue(record['last_name'])) {
        errors += 1;
      }

      if (!this.hasValue(record['job_title'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['hire_date'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['status'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['assigned_location_id'])) {
        warnings += 1;
      }
    }

    return { errors, warnings };
  }

  private validateConsumers(records: Record<string, string>[]): ValidationCounts {
    let errors = 0;
    let warnings = 0;
    const consumerIds = new Set<string>();

    for (const record of records) {
      const consumerId = this.clean(record['consumer_id']);

      if (!this.hasValue(consumerId)) {
        errors += 1;
      } else if (consumerIds.has(consumerId)) {
        errors += 1;
      } else {
        consumerIds.add(consumerId);
      }

      if (!this.hasValue(record['first_name'])) {
        errors += 1;
      }

      if (!this.hasValue(record['last_name'])) {
        errors += 1;
      }

      if (!this.hasValue(record['medicaid_number'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['date_of_birth'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['assigned_location_id'])) {
        errors += 1;
      }

      if (!this.hasValue(record['level_of_need'])) {
        warnings += 1;
      }
    }

    return { errors, warnings };
  }

  private validateLocations(records: Record<string, string>[]): ValidationCounts {
    let errors = 0;
    let warnings = 0;
    const locationIds = new Set<string>();

    for (const record of records) {
      const locationId = this.clean(record['location_id']);

      if (!this.hasValue(locationId)) {
        errors += 1;
      } else if (locationIds.has(locationId)) {
        errors += 1;
      } else {
        locationIds.add(locationId);
      }

      if (!this.hasValue(record['location_name'])) {
        errors += 1;
      }

      if (!this.hasValue(record['location_type'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['address'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['city'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['state'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['zip'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['capacity'])) {
        errors += 1;
      } else if (Number.isNaN(Number(this.clean(record['capacity'])))) {
        errors += 1;
      }
    }

    return { errors, warnings };
  }

  private validateTraining(records: Record<string, string>[]): ValidationCounts {
    let errors = 0;
    let warnings = 0;

    for (const record of records) {
      if (!this.hasValue(record['employee_id'])) {
        errors += 1;
      }

      if (!this.hasValue(record['training_name'])) {
        errors += 1;
      }

      if (!this.hasValue(record['completion_date'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['expiration_date'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['trainer'])) {
        warnings += 1;
      }
    }

    return { errors, warnings };
  }

  private validateAuthorizations(
    records: Record<string, string>[],
  ): ValidationCounts {
    let errors = 0;
    let warnings = 0;

    for (const record of records) {
      if (!this.hasValue(record['consumer_id'])) {
        errors += 1;
      }

      if (!this.hasValue(record['service_code'])) {
        errors += 1;
      }

      if (!this.hasValue(record['service_name'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['start_date'])) {
        errors += 1;
      }

      if (!this.hasValue(record['end_date'])) {
        warnings += 1;
      }

      if (!this.hasValue(record['authorized_units'])) {
        warnings += 1;
      } else if (Number.isNaN(Number(this.clean(record['authorized_units'])))) {
        errors += 1;
      }
    }
   
    return { errors, warnings };
  }

  private calculateScore(
    requirement: string,
    errors: number,
    warnings: number,
  ): number {
    let score = 100;

    score -= errors * 25;
    score -= warnings * 8;

    if (requirement === 'optional') {
      score = Math.max(score, 80);
    }

    return Math.max(score, 0);
  }

  private hasValue(value: string | undefined | null): boolean {
    return this.clean(value).length > 0;
  }

  private clean(value: string | undefined | null): string {
    return String(value ?? '')
      .replace(/\u00a0/g, ' ')
      .trim();
  }
}