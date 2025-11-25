// libs/data-access/src/lib/iss/src/lib/services/staff-log.service.ts
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiService } from '../base-api.service';
import {
  StaffLog,
  WeekSummary,
  CreateStaffLogDto,
  UpdateStaffLogDto,
} from '@hhsc-compliance/shared-models'; // adjust to your models lib

@Injectable({ providedIn: 'root' })
export class StaffLogService extends BaseApiService {
  // base path for staff logs
  private readonly staffLogsPath = '/iss/staff-logs';

  createLog(payload: CreateStaffLogDto): Observable<StaffLog> {
    const url = this.buildUrl(this.staffLogsPath); // POST /api/v1/iss/staff-logs
    return this.post<StaffLog>(url, payload);
  }

  updateLog(id: number | string, payload: UpdateStaffLogDto): Observable<StaffLog> {
    const url = this.buildUrl(`${this.staffLogsPath}/${id}`); // PATCH /api/v1/iss/staff-logs/:id
    return this.patch<StaffLog>(url, payload);
  }

  /**
   * List all logs for a consumer
   * GET /api/v1/iss/staff-logs/:consumerId
   */
  getLogsForConsumer(consumerId: number | string): Observable<StaffLog[]> {
    const url = this.buildUrl(`${this.staffLogsPath}/${consumerId}`);
    return this.get<StaffLog[]>(url);
  }

  /**
   * Weeks + statuses for ISS calendar
   * GET /api/v1/iss/consumer/:id/weeks
   */
  getWeeksForConsumer(consumerId: number | string): Observable<WeekSummary[]> {
    const url = this.buildUrl(`/iss/consumer/${consumerId}/weeks`);
    return this.get<WeekSummary[]>(url); // backend returns whatever your svc.listWeeksForConsumer emits
  }

  /**
   * Latest-or-template for a specific date
   * GET /api/v1/iss/consumer/:id/log?date=YYYY-MM-DD
   */
  getLogByServiceDate(
    consumerId: number | string,
    serviceDate: string,
  ): Observable<StaffLog | null> {
    const url = this.buildUrl(`/iss/consumer/${consumerId}/log`);
    // backend response is { consumer, log, defaultTemplate? }
    return this.get<{ consumer: any; log: StaffLog | null; defaultTemplate?: any }>(
      url,
      { date: serviceDate },
    ).pipe(
      // if you want just a StaffLog|null at the API layer:
      map((res) => res.log ?? null),
    );
  }

  /**
   * Latest log for consumer
   * GET /api/v1/iss/consumer/:id/latest-log
   */
  getLatestLogForConsumer(
    consumerId: number | string,
  ): Observable<StaffLog | null> {
    const url = this.buildUrl(`/iss/consumer/${consumerId}/latest-log`);
    return this.get<{ consumer: any; latestLog: StaffLog | null }>(url).pipe(
      map((res) => res.latestLog),
    );
  }
}
