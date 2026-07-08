import { Injectable } from '@angular/core';

import {
  OnboardingBuildPlan,
  OnboardingBuildPlanItem,
  OnboardingBuildResult,
  OnboardingSession,
} from '@hhsc-compliance/shared-models';

@Injectable({
  providedIn: 'root',
})
export class BuildEngineService {
  createPlan(session: OnboardingSession): OnboardingBuildPlan {
    const uploadedTemplates = session.templates.filter(
      (template) => template.uploaded,
    );

    const items: OnboardingBuildPlanItem[] = [
      {
        id: 'provider',
        label: 'Provider',
        count: session.provider.agencyName ? 1 : 0,
        status: 'pending',
      },
      {
        id: 'residential-locations',
        label: 'Residential Locations',
        count: this.getTemplateCount(uploadedTemplates, [
          'residential',
          'location',
          'home',
        ]),
        status: 'pending',
      },
      {
        id: 'consumers',
        label: 'Consumers',
        count: this.getTemplateCount(uploadedTemplates, ['consumer']),
        status: 'pending',
      },
      {
        id: 'employees',
        label: 'Employees',
        count: this.getTemplateCount(uploadedTemplates, ['employee', 'staff']),
        status: 'pending',
      },
      {
        id: 'relationships',
        label: 'Relationships',
        count: this.estimateRelationships(uploadedTemplates),
        status: 'pending',
      },
      {
        id: 'compliance-modules',
        label: 'Compliance Modules',
        count: this.estimateComplianceModules(uploadedTemplates),
        status: 'pending',
      },
    ];

    return {
      providerName: session.provider.agencyName || 'New Provider',
      estimatedSeconds: Math.max(6, uploadedTemplates.length * 3),
      items,
    };
  }

  async build(session: OnboardingSession): Promise<OnboardingBuildResult> {
    const plan = session.buildPlan ?? this.createPlan(session);

    await new Promise((resolve) =>
      setTimeout(resolve, plan.estimatedSeconds * 250),
    );

    return {
      providerId: this.createId(),
      providerName: session.provider.agencyName || 'New Provider',
      createdAt: new Date().toISOString(),
      durationSeconds: plan.estimatedSeconds,
      created: {
        providers: this.getPlanCount(plan, 'provider'),
        residentialLocations: this.getPlanCount(plan, 'residential-locations'),
        consumers: this.getPlanCount(plan, 'consumers'),
        employees: this.getPlanCount(plan, 'employees'),
        relationships: this.getPlanCount(plan, 'relationships'),
        complianceModules: this.getPlanCount(plan, 'compliance-modules'),
      },
      warnings: [],
    };
  }

  private getPlanCount(plan: OnboardingBuildPlan, id: string): number {
    return plan.items.find((item) => item.id === id)?.count ?? 0;
  }

  private getTemplateCount(
    templates: { id: string; name: string; recordsFound?: number }[],
    terms: string[],
  ): number {
    const match = templates.find((template) => {
      const haystack = `${template.id} ${template.name}`.toLowerCase();

      return terms.some((term) => haystack.includes(term));
    });

    return match?.recordsFound ?? 0;
  }

  private estimateRelationships(
    templates: { recordsFound?: number }[],
  ): number {
    const totalRecords = templates.reduce(
      (total, template) => total + (template.recordsFound ?? 0),
      0,
    );

    return Math.round(totalRecords * 1.5);
  }

  private estimateComplianceModules(
    templates: { recordsFound?: number }[],
  ): number {
    const totalRecords = templates.reduce(
      (total, template) => total + (template.recordsFound ?? 0),
      0,
    );

    return Math.max(0, Math.round(totalRecords * 0.4));
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `provider-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}