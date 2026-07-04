import type { WorkflowDefinition } from '@hhsc-compliance/ui-kit';

export const AGENCY_CREATION_WORKFLOW: WorkflowDefinition = {
  id: 'agency-creation',
  title: 'Agency Creation',
  subtitle: 'Build your organization from existing records.',
  showProgress: true,
  allowStepNavigation: false,
  autoSave: true,
  steps: [
    {
      id: 'setup',
      title: 'Setup',
      description: 'Choose how to build your agency.',
      route: '/provider-onboarding/agency-creation',
    },
    {
      id: 'import',
      title: 'Import',
      description: 'Upload your existing records.',
      route: '/provider-onboarding/agency-creation/csv-import',
    },
    {
      id: 'validation',
      title: 'Validation',
      description: 'Review import warnings and errors.',
      route: '/provider-onboarding/agency-creation/validation',
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Confirm records before building.',
      route: '/provider-onboarding/agency-creation/review',
    },
    {
      id: 'build',
      title: 'Build',
      description: 'Create agency records.',
      route: '/provider-onboarding/agency-creation/build',
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Finish onboarding.',
      route: '/provider-onboarding/agency-creation/complete',
    },
  ],
};