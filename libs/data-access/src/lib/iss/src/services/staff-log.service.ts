// libs/data-access/src/lib/iss/src/lib/services/staff-log.service.ts
/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseApiService } from '../../../api-core/base-api.service';
import {
  StaffLog,
  WeekSummary,
  CreateStaffLogDto,
  UpdateStaffLogDto,
  Consumer,
} from '@hhsc-compliance/shared-models';

interface ApiWeekRow {
  weekNumber: number;
  serviceDate: string;        // e.g. "2025-09-29"
  staffLogId: number | null;  // numeric or null
  totalHours?: number;
  status?: WeekSummary['status'];
}

interface ApiWeeksResponse {
  data: ApiWeekRow[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

@Injectable({ providedIn: 'root' })
export class StaffLogService extends BaseApiService {
  /** Base path for ISS endpoints (maps to /api/v1/iss) */
  private readonly issPath = '/iss';

  // ========= YEAR GRID (WEEKS) =========

  /** GET /api/v1/iss/consumer/:id/weeks?page=1&limit=52 */
  getWeeksForConsumer(consumerId: number): Observable<WeekSummary[]> {
    const url = this.buildUrl(`${this.issPath}/consumer/${consumerId}/weeks`);

    return this.get<ApiWeeksResponse>(url, {
      page: 1,
      limit: 52,
    }).pipe(
      map((res) => (res.data ?? []).map((row) => this.toWeekSummary(row))),
    );
  }

  /** Map raw API row → WeekSummary used by the year grid */
  private toWeekSummary(row: ApiWeekRow): WeekSummary {
    const hasLog = !!row.staffLogId;

    return {
      weekNumber: row.weekNumber,
      serviceDate: row.serviceDate,
      hasLog,
      // keep this optional if WeekSummary.logId is optional
      logId: row.staffLogId ?? undefined,
      // 👇 default to 'draft' when we have a log but no status yet
      status: row.status ?? (hasLog ? 'draft' : undefined),
      totalHours: row.totalHours,
    };
  }

  // ========= SINGLE WEEK LOG (LOAD OR CREATE) =========

  /**
   * GET /api/v1/iss/consumer/:id/log?date=YYYY-MM-DD
   * Nest returns: { consumer, log, defaultTemplate? }
   * We only care about `log` here.
   */
  getLogByServiceDate(
    consumerId: number,
    serviceDate: string,
  ): Observable<StaffLog | null> {
    const url = this.buildUrl(`${this.issPath}/consumer/${consumerId}/log`);

    return this.get<{
      consumer: Consumer;
      log: StaffLog | null;
      defaultTemplate?: unknown;
    }>(url, { date: serviceDate }).pipe(map((res) => res.log));
  }

  // ========= CRUD FOR STAFF LOGS =========

  /** POST /api/v1/iss/staff-logs */
  createLog(payload: CreateStaffLogDto): Observable<StaffLog> {
    const url = this.buildUrl(`${this.issPath}/staff-logs`);
    return this.post<StaffLog>(url, payload);
  }

  /** PATCH /api/v1/iss/staff-logs/:id */
  updateLog(id: number, payload: UpdateStaffLogDto): Observable<StaffLog> {
    const url = this.buildUrl(`${this.issPath}/staff-logs/${id}`);
    return this.patch<StaffLog>(url, payload);
  }
}
