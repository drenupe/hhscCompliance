import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ComplianceHeatLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ComplianceHeatMapCell {
  module: string;
  location: string;
  level: ComplianceHeatLevel;
  score: number;
  findingCount: number;
  criticalCount?: number;
  highCount?: number;
  routeCommands?: string[] | null;
  queryParams?: Record<string, unknown> | null;
}

export interface ComplianceHeatMapRow {
  module: string;
  title: string;
  overallLevel?: ComplianceHeatLevel;
  overallScore?: number;
  worstLocation?: string;
  cells: ComplianceHeatMapCell[];
}

@Component({
  selector: 'lib-compliance-heat-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compliance-heat-map.component.html',
  styleUrl: './compliance-heat-map.component.scss',
})
export class ComplianceHeatMapComponent {
  @Input() kicker = 'Compliance Heat Map';
  @Input() title = 'Risk concentration by module';
  @Input() summary = 'Shows where compliance risk is concentrated.';
  @Input() locations: string[] = [];
  @Input() rows: ComplianceHeatMapRow[] = [];

  @Output() open = new EventEmitter<ComplianceHeatMapCell>();

  openCell(cell: ComplianceHeatMapCell): void {
    this.open.emit(cell);
  }

  overallScore(row: ComplianceHeatMapRow): number {
    if (row.overallScore !== undefined) {
      return row.overallScore;
    }

    if (!row.cells.length) {
      return 0;
    }

    return Math.round(
      row.cells.reduce((sum, cell) => sum + cell.score, 0) / row.cells.length,
    );
  }

  overallLevel(row: ComplianceHeatMapRow): ComplianceHeatLevel {
    return row.overallLevel ?? this.levelFromScore(this.overallScore(row));
  }

  worstLocation(row: ComplianceHeatMapRow): string {
    if (row.worstLocation) {
      return row.worstLocation;
    }

    const worst = [...row.cells].sort((a, b) => b.score - a.score)[0];
    return worst?.location ?? 'None';
  }

  private levelFromScore(score: number): ComplianceHeatLevel {
    if (score >= 75) return 'CRITICAL';
    if (score >= 45) return 'HIGH';
    if (score >= 20) return 'MODERATE';

    return 'LOW';
  }
}