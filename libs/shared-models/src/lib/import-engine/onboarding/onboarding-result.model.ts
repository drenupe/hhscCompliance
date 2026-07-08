export interface OnboardingBuildResult {
  providerId: string;
  providerName: string;
  createdAt: string;
  durationSeconds: number;

  created: {
    providers: number;
    residentialLocations: number;
    consumers: number;
    employees: number;
    relationships: number;
    complianceModules: number;
  };

  warnings: string[];
}