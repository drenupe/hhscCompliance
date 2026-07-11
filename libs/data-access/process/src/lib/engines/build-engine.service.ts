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
        label: 'Create Provider',
        count: 1,
        status: 'pending',
      },
      {
        id: 'residential-locations',
        label: 'Create Residential Locations',
        count: this.getTemplateCount(uploadedTemplates, ['locations']),
        status: 'pending',
      },
      {
        id: 'employees',
        label: 'Create Employees',
        count: this.getTemplateCount(uploadedTemplates, ['employees']),
        status: 'pending',
      },
      {
        id: 'consumers',
        label: 'Create Consumers',
        count: this.getTemplateCount(uploadedTemplates, ['consumers']),
        status: 'pending',
      },
      {
        id: 'relationships',
        label: 'Link Relationships',
        count: this.estimateRelationships(uploadedTemplates),
        status: 'pending',
      },
      {
        id: 'compliance-modules',
        label: 'Generate Compliance Baseline',
        count: this.estimateComplianceModules(uploadedTemplates),
        status: 'pending',
      },
      {
        id: 'dashboard',
        label: 'Prepare Provider Dashboard',
        count: 1,
        status: 'pending',
      },
    ];

    return {
      providerName: session.provider.agencyName || 'New Provider',
      estimatedSeconds: Math.max(8, items.length * 2),
      items,
    };
  }

  async build(session: OnboardingSession): Promise<OnboardingBuildResult> {
    const plan = session.buildPlan ?? this.createPlan(session);

    await this.delay(600);

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

    return Math.max(1, Math.round(totalRecords * 1.5));
  }

  private estimateComplianceModules(
    templates: { recordsFound?: number }[],
  ): number {
    const totalRecords = templates.reduce(
      (total, template) => total + (template.recordsFound ?? 0),
      0,
    );

    return Math.max(1, Math.round(totalRecords * 0.4));
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `provider-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}