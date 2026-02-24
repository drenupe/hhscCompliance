// libs/data-access/src/lib/iss/src/lib/services/staff-logs.api.ts
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BaseApiService } from '../../../api-core/base-api.service';

import {
  Consumer,
  CreateStaffLogDto,
  StaffLog,
  UpdateStaffLogDto,
  WeekSummary,
} from '@hhsc-compliance/shared-models';

interface ApiWeekRow {
  weekNumber: number;
  serviceDate: string;        // "YYYY-MM-DD"
  staffLogId: number | null;
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
export class StaffLogsApi extends BaseApiService {
  /** Maps to /api/v1/iss/... */
  private readonly base = 'v1/iss';

  // ========= YEAR GRID (WEEKS) =========

  /** GET /api/v1/iss/consumer/:id/weeks?page=1&limit=52 */
  getWeeksForConsumer(consumerId: number): Observable<WeekSummary[]> {
    const url = this.buildUrl(`${this.base}/consumer/${consumerId}/weeks`);
    return this.get<ApiWeeksResponse>(url, { page: 1, limit: 52 }).pipe(
      map((res) => (res.data ?? []).map((row) => this.toWeekSummary(row))),
    );
  }

  // ========= SINGLE WEEK LOG =========

  /**
   * GET /api/v1/iss/consumer/:id/log?date=YYYY-MM-DD
   * returns { consumer, log, defaultTemplate? }
   */
  getLogByServiceDate(
    consumerId: number,
    serviceDate: string,
  ): Observable<StaffLog | null> {
    const url = this.buildUrl(`${this.base}/consumer/${consumerId}/log`);
    return this.get<{ consumer: Consumer; log: StaffLog | null }>(url, {
      date: serviceDate,
    }).pipe(map((res) => res.log ?? null));
  }

  // ========= CRUD =========

  /** POST /api/v1/iss/staff-logs */
  create(payload: CreateStaffLogDto): Observable<StaffLog> {
    const url = this.buildUrl(`${this.base}/staff-logs`);
    return this.post<StaffLog>(url, payload);
  }

  /** PATCH /api/v1/iss/staff-logs/:id */
  update(id: number, payload: UpdateStaffLogDto): Observable<StaffLog> {
    const url = this.buildUrl(`${this.base}/staff-logs/${id}`);
    return this.patch<StaffLog>(url, payload);
  }

  // ========= mappers =========

  private toWeekSummary(row: ApiWeekRow): WeekSummary {
    const hasLog = !!row.staffLogId;

    return {
      weekNumber: row.weekNumber,
      serviceDate: row.serviceDate,
      hasLog,
      logId: row.staffLogId ?? undefined,
      status: row.status ?? (hasLog ? 'draft' : undefined),
      totalHours: row.totalHours,
    };
  }
}