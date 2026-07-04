import { StepperStep } from "../stepper/models/stepper.model";

export interface WorkflowDefinition {
  id: string;

  title: string;

  subtitle?: string;

  icon?: string;

  showProgress?: boolean;

  allowStepNavigation?: boolean;

  autoSave?: boolean;

  steps: StepperStep[];
}