import { Injectable } from '@angular/core';

import {
  ImportTemplate,
  OnboardingReadiness,
  OnboardingReadinessCategory,
} from '@hhsc-compliance/shared-models';

@Injectable({
  providedIn: 'root',
})
export class ValidationEngineService {
  evaluate(templates: ImportTemplate[]): OnboardingReadiness {
    const categories: OnboardingReadinessCategory[] = templates.map(
      (template) => {
        const errors = template.uploaded ? 0 : template.requirement === 'required' ? 1 : 0;

        const warnings =
          template.requirement === 'recommended' && !template.uploaded ? 1 : 0;

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

    const errors = categories.reduce((t, c) => t + c.errors, 0);

    const warnings = categories.reduce((t, c) => t + c.warnings, 0);

    const overallScore =
      categories.length === 0
        ? 0
        : Math.round(
            categories.reduce((t, c) => t + c.score, 0) /
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

  private calculateScore(
    requirement: string,
    errors: number,
    warnings: number,
  ): number {
    let score = 100;

    score -= errors * 40;

    score -= warnings * 10;

    if (requirement === 'optional') {
      score = Math.max(score, 80);
    }

    return Math.max(score, 0);
  }
}