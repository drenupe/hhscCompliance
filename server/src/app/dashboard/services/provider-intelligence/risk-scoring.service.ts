import { Injectable } from '@nestjs/common';
import { ProviderModuleRiskScore, ProviderRiskLevel } from '../../types/provider-intelligence.types';


@Injectable()
export class RiskScoringService {
  toModuleRiskScore(row: any): ProviderModuleRiskScore {
    const module = String(row.module ?? 'UNKNOWN');
    const openFindings = Number(row.open_findings ?? 0);
    const criticalFindings = Number(row.critical_findings ?? 0);
    const highFindings = Number(row.high_findings ?? 0);

    const riskScore = Math.min(
      100,
      criticalFindings * 30 + highFindings * 15 + openFindings * 5,
    );

    return {
      module,
      title: this.moduleTitle(module),
      openFindings,
      criticalFindings,
      highFindings,
      riskScore,
      riskLevel: this.riskLevelFromRiskScore(riskScore),
    };
  }

  riskLevelFromHealthScore(score: number): ProviderRiskLevel {
    if (score >= 85) return 'LOW';
    if (score >= 70) return 'MODERATE';
    if (score >= 50) return 'HIGH';
    return 'CRITICAL';
  }

  riskLevelFromRiskScore(score: number): ProviderRiskLevel {
    if (score >= 75) return 'CRITICAL';
    if (score >= 45) return 'HIGH';
    if (score >= 20) return 'MODERATE';
    return 'LOW';
  }

  private moduleTitle(module: string): string {
    const titles: Record<string, string> = {
      RESIDENTIAL: 'Residential Requirements',
      PROGRAMMATIC: 'Programmatic Requirements',
      FINANCES_RENT: 'Finances & Rent',
      BEHAVIOR_SUPPORT: 'Behavior Support Plan',
      ANE: 'Abuse, Neglect & Exploitation',
      RESTRAINTS: 'Restraints',
      ENCLOSED_BEDS: 'Enclosed Beds',
      PROTECTIVE_DEVICES: 'Protective Devices',
      PROHIBITIONS: 'Prohibitions',
      ISS: 'ISS',
      MEDICATION: 'Medication',
      NURSING: 'Nursing',
      FIRE_DRILLS: 'Fire Drills',
      EMERGENCY_PLANS: 'Emergency Plans',
      HOT_WATER: 'Hot Water',
      LIFE_SAFETY: 'Life Safety',
      INFECTION_CONTROL: 'Infection Control',
    };

    return titles[module] ?? module.replace(/_/g, ' ');
  }
}