export interface OnboardingReadinessCategory {
  id: string;
  label: string;
  score: number;
  errors: number;
  warnings: number;
  complete: boolean;
}

export interface OnboardingReadiness {
  overallScore: number;
  readyToBuild: boolean;
  errors: number;
  warnings: number;
  categories: OnboardingReadinessCategory[];
}