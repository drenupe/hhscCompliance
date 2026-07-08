import { ImportTemplate } from '../import-template.model';
import { OnboardingBuildPlan } from './onboarding-build-plan.model';
import { OnboardingReadiness } from './onboarding-readiness.model';
import { OnboardingStep } from './onboarding-step.model';

export interface OnboardingProviderSetup {
  agencyName: string;
  licenseNumber: string;
  region?: string;
  administratorName?: string;
  phone?: string;
  email?: string;
}

export interface OnboardingSession {
  id: string;
  currentStep: OnboardingStep;
  provider: OnboardingProviderSetup;
  templates: ImportTemplate[];
  readiness: OnboardingReadiness;
  buildPlan?: OnboardingBuildPlan;
  startedAt: string;
  updatedAt: string;
}