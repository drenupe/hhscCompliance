import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import {
  CaseManagerWorkQueueItem,
  CaseManagerWorkQueueView,
} from '../../../../../libs/shared-models/src/lib/dashboard/types/dashboard.types';
import { normalizeSeverity, titleForSection } from './dashboard-labels';

@Injectable()
export class CaseManagerWorkQueueService {
  constructor(private readonly ds: DataSource) {}

  async getWorkQueue(locationId: string): Promise<CaseManagerWorkQueueView> {
    const [
      openCaps,
      readyForReview,
      overdueCaps,
      highSeverityFindings,
      evidenceMissing,
      recheckQueue,
    ] = await Promise.all([
      this.getOpenCaps(locationId),
      this.getReadyForReview(locationId),
      this.getOverdueCaps(locationId),
      this.getHighSeverityFindings(locationId),
      this.getEvidenceMissing(locationId),
      this.getRecheckQueue(locationId),
    ]);

    return {
      openCaps,
      readyForReview,
      overdueCaps,
      highSeverityFindings,
      evidenceMissing,
      recheckQueue,
    };
  }

  private async getOpenCaps(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cap.id,
        cap.status,
        cap.target_completion_date AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM corrective_action_plans cap
      INNER JOIN compliance_results cr
        ON cr.id = cap.compliance_result_id
      WHERE cr.location_id = $1
        AND cap.status IN ('OPEN', 'IN_PROGRESS')
      ORDER BY
        CASE cr.severity
          WHEN 'CRITICAL' THEN 4
          WHEN 'HIGH' THEN 3
          WHEN 'MEDIUM' THEN 2
          WHEN 'MED' THEN 2
          WHEN 'LOW' THEN 1
          ELSE 0
        END DESC,
        cap.target_completion_date ASC NULLS LAST,
        cap.updated_at DESC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) => this.toWorkQueueItem(row, 'CAP Open'));
  }

  private async getReadyForReview(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cap.id,
        cap.status,
        cap.target_completion_date AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM corrective_action_plans cap
      INNER JOIN compliance_results cr
        ON cr.id = cap.compliance_result_id
      WHERE cr.location_id = $1
        AND cap.status = 'READY_FOR_REVIEW'
      ORDER BY cap.updated_at DESC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) =>
      this.toWorkQueueItem(row, 'Ready For Review'),
    );
  }

  private async getOverdueCaps(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cap.id,
        cap.status,
        cap.target_completion_date AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM corrective_action_plans cap
      INNER JOIN compliance_results cr
        ON cr.id = cap.compliance_result_id
      WHERE cr.location_id = $1
        AND cap.target_completion_date IS NOT NULL
        AND cap.target_completion_date < NOW()
        AND cap.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')
      ORDER BY cap.target_completion_date ASC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) => this.toWorkQueueItem(row, 'CAP Overdue'));
  }

  private async getHighSeverityFindings(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cr.id,
        cr.status,
        NULL AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM compliance_results cr
      WHERE cr.location_id = $1
        AND cr.status IN ('NON_COMPLIANT', 'UNKNOWN')
        AND cr.severity IN ('HIGH', 'CRITICAL')
      ORDER BY
        CASE cr.severity
          WHEN 'CRITICAL' THEN 4
          WHEN 'HIGH' THEN 3
          ELSE 0
        END DESC,
        cr.updated_at DESC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) =>
      this.toWorkQueueItem(row, 'High Severity Finding'),
    );
  }

  private async getEvidenceMissing(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cap.id,
        cap.status,
        cap.target_completion_date AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM corrective_action_plans cap
      INNER JOIN compliance_results cr
        ON cr.id = cap.compliance_result_id
      LEFT JOIN cap_evidence ev
        ON ev.cap_id = cap.id
      WHERE cr.location_id = $1
        AND cap.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')
      GROUP BY
        cap.id,
        cap.status,
        cap.target_completion_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      HAVING COUNT(ev.id) = 0
      ORDER BY cap.target_completion_date ASC NULLS LAST, cap.updated_at DESC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) =>
      this.toWorkQueueItem(row, 'Evidence Missing'),
    );
  }

  private async getRecheckQueue(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cr.id,
        cr.status,
        cr.next_check_at AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM compliance_results cr
      WHERE cr.location_id = $1
        AND cr.needs_recheck = true
      ORDER BY cr.next_check_at ASC NULLS LAST, cr.updated_at DESC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) => this.toWorkQueueItem(row, 'Needs Recheck'));
  }

  private toWorkQueueItem(
    row: any,
    label: string,
  ): CaseManagerWorkQueueItem {
    const module = row.module ? String(row.module) : null;
    const subcategory = row.subcategory ? String(row.subcategory) : null;
    const ruleCode = row.rule_code ? String(row.rule_code) : null;
    const severity = normalizeSeverity(row.severity);
    const message = row.message ? String(row.message) : null;
    const sectionKey = subcategory ?? module ?? 'UNKNOWN';
    const locationId = row.location_id ? String(row.location_id) : null;

    return {
      id: String(row.id),
      title: `${label}: ${titleForSection(module ?? 'UNKNOWN', sectionKey)}`,
      status: row.status ? String(row.status) : 'UNKNOWN',
      severity,
      module,
      subcategory,
      ruleCode,
      message,
      dueDate: row.due_date ? new Date(row.due_date).toISOString() : null,
      locationId,
      routeCommands:
        row.route_commands ??
        this.linkForSection(locationId ?? '', module ?? 'UNKNOWN', sectionKey),
      queryParams:
        row.query_params ?? {
          locationId,
          module,
          subcategory: sectionKey,
        },
    };
  }

  private linkForSection(
    locationId: string | null | undefined,
    module: string,
    sectionKey: string,
  ): any[] {
    if (module !== 'RESIDENTIAL') {
      return ['/', 'compliance', 'message-center'];
    }

    switch (sectionKey) {
      case 'HOME_ENVIRONMENT':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'home-environment',
        ];

      case 'HOT_WATER':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'home-environment',
          'hot-water',
        ];

      case 'LIFE_SAFETY':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'life-safety',
        ];

      case 'FIRE_DRILLS':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'emergency',
          'fire-drills',
        ];

      case 'EMERGENCY_PLANS':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'emergency',
          'plans',
        ];

      case 'INFECTION_CONTROL':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'infection-control',
        ];

      case 'MEDICATION':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'medication',
        ];

      case 'NURSING':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'nursing',
        ];

      case 'FOUR_PERSON':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'four-person',
        ];

      default:
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'overview',
        ];
    }
  }
}