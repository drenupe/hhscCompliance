import { Injectable, computed, signal } from '@angular/core';

import {
  ImportTemplate,
  OnboardingBuildPlan,
  OnboardingBuildResult,
  OnboardingProviderSetup,
  OnboardingReadiness,
  OnboardingSession,
  OnboardingStep,
} from '@hhsc-compliance/shared-models';

import {
  ImportReport,
  MappedImportTable,
  RelationshipIssue,
} from '@hhsc-compliance/shared-models';

@Injectable({
  providedIn: 'root',
})
export class ProcessStateService {
  private readonly sessionSignal = signal<OnboardingSession>(
    this.createInitialSession(),
  );

  private readonly resultSignal = signal<OnboardingBuildResult | null>(null);

  private readonly mappedTablesSignal = signal<MappedImportTable[]>([]);
  private readonly relationshipIssuesSignal = signal<RelationshipIssue[]>([]);
  private readonly importReportSignal = signal<ImportReport | null>(null);

  readonly session = this.sessionSignal.asReadonly();
  readonly result = this.resultSignal.asReadonly();

  readonly mappedTables = this.mappedTablesSignal.asReadonly();
  readonly relationshipIssues = this.relationshipIssuesSignal.asReadonly();
  readonly importReport = this.importReportSignal.asReadonly();

  readonly currentStep = computed(() => this.session().currentStep);
  readonly provider = computed(() => this.session().provider);
  readonly templates = computed(() => this.session().templates);
  readonly readiness = computed(() => this.session().readiness);
  readonly buildPlan = computed(() => this.session().buildPlan);

  updateProvider(provider: Partial<OnboardingProviderSetup>): void {
    const current = this.session();

    this.patchSession({
      provider: {
        ...current.provider,
        ...provider,
      },
    });
  }

  setStep(step: OnboardingStep): void {
    this.patchSession({
      currentStep: step,
    });
  }

  setTemplates(templates: ImportTemplate[]): void {
    this.patchSession({
      templates,
    });
  }

  updateTemplate(templateId: string, patch: Partial<ImportTemplate>): void {
    const current = this.session();

    this.patchSession({
      templates: current.templates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              ...patch,
            }
          : template,
      ),
    });
  }

  setReadiness(readiness: OnboardingReadiness): void {
    this.patchSession({
      readiness,
    });
  }

  setBuildPlan(buildPlan: OnboardingBuildPlan): void {
    this.patchSession({
      buildPlan,
    });
  }

  setMappedTables(tables: MappedImportTable[]): void {
    this.mappedTablesSignal.set(tables);
    this.touchSession();
  }

  addMappedTable(table: MappedImportTable): void {
    this.mappedTablesSignal.update((tables) => [
      ...tables.filter((item) => item.id !== table.id),
      table,
    ]);

    this.touchSession();
  }

  removeMappedTable(tableId: string): void {
    this.mappedTablesSignal.update((tables) =>
      tables.filter((table) => table.id !== tableId),
    );

    this.touchSession();
  }

  setRelationshipIssues(issues: RelationshipIssue[]): void {
    this.relationshipIssuesSignal.set(issues);
    this.touchSession();
  }

  setImportReport(report: ImportReport | null): void {
    this.importReportSignal.set(report);
    this.touchSession();
  }

  setResult(result: OnboardingBuildResult): void {
    this.resultSignal.set(result);
    this.setStep('complete');
  }

  clearResult(): void {
    this.resultSignal.set(null);
  }

  reset(): void {
    this.resultSignal.set(null);
    this.mappedTablesSignal.set([]);
    this.relationshipIssuesSignal.set([]);
    this.importReportSignal.set(null);
    this.sessionSignal.set(this.createInitialSession());
  }

  private touchSession(): void {
    this.patchSession({});
  }

  private patchSession(patch: Partial<OnboardingSession>): void {
    this.sessionSignal.update((session) => ({
      ...session,
      ...patch,
      updatedAt: new Date().toISOString(),
    }));
  }

  private createInitialSession(): OnboardingSession {
    const now = new Date().toISOString();

    return {
      id: this.createId(),
      currentStep: 'setup',
      provider: {
        agencyName: '',
        licenseNumber: '',
        region: '',
        administratorName: '',
        phone: '',
        email: '',
      },
      templates: [],
      readiness: {
        overallScore: 0,
        readyToBuild: false,
        errors: 0,
        warnings: 0,
        categories: [],
      },
      buildPlan: undefined,
      startedAt: now,
      updatedAt: now,
    };
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `onboarding-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
  }
}