import { Injectable, inject } from '@angular/core';

import {
  ImportTemplate,
  OnboardingProviderSetup,
  OnboardingSession,
} from '@hhsc-compliance/shared-models';
import { ProcessStateService } from '../state';


@Injectable({
  providedIn: 'root',
})
export class ImportSessionService {
  private readonly state = inject(ProcessStateService);

  readonly session = this.state.session;

  updateProvider(provider: Partial<OnboardingProviderSetup>): void {
    this.state.updateProvider(provider);
  }

  setTemplates(templates: ImportTemplate[]): void {
    this.state.setTemplates(templates);
  }

  updateTemplate(templateId: string, patch: Partial<ImportTemplate>): void {
    this.state.updateTemplate(templateId, patch);
  }

  getSnapshot(): OnboardingSession {
    return this.state.session();
  }

  reset(): void {
    this.state.reset();
  }
}