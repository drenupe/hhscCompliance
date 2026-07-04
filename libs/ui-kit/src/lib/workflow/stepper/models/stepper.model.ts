export type StepperVariant =
  | 'number'
  | 'tabs'
  | 'arrow'
  | 'dots'
  | 'timeline'
  | 'progress';

export type StepperOrientation = 'horizontal' | 'vertical';

export type StepperSize = 'compact' | 'comfortable' | 'large';

export type StepperWidth = 'auto' | 'fill' | 'content';

export type StepperAlignment = 'start' | 'center' | 'end' | 'space-between';

export type StepStatus =
  | 'pending'
  | 'active'
  | 'complete'
  | 'warning'
  | 'error'
  | 'disabled';

export interface StepperStep {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  badge?: string;
  route?: string;
  status?: StepStatus;
  optional?: boolean;
  disabled?: boolean;
}

export interface StepperConfig {
  variant: StepperVariant;
  orientation: StepperOrientation;
  size: StepperSize;
  width: StepperWidth;
  alignment: StepperAlignment;
  clickable: boolean;
  showNumbers: boolean;
  showDescriptions: boolean;
  showIcons: boolean;
  showProgress: boolean;
  responsive: boolean;
}