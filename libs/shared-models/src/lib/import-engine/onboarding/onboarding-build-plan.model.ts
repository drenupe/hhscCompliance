export interface OnboardingBuildPlanItem {
  id: string;
  label: string;
  count: number;
  status: 'pending' | 'building' | 'complete' | 'failed';
}

export interface OnboardingBuildPlan {
  providerName: string;
  estimatedSeconds: number;
  items: OnboardingBuildPlanItem[];
}