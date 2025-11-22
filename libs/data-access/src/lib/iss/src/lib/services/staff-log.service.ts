import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base-api.service';
import {
  StaffLog,
  WeekSummary,
  CreateStaffLogDto,
  UpdateStaffLogDto,
} from '@hhsc-compliance/shared-models';

@Injectable({
  providedIn: 'root',
})
export class StaffLogService extends BaseApiService {
  // Adjust this to match your NestJS route prefix if needed
  private readonly staffLogsPath = '/iss/staff-logs';

  getLogById(id: string): Observable<StaffLog> {
    const url = this.buildUrl(`${this.staffLogsPath}/${id}`);
    return this.get<StaffLog>(url);
  }

  createLog(payload: CreateStaffLogDto): Observable<StaffLog> {
    const url = this.buildUrl(this.staffLogsPath);
    return this.post<StaffLog>(url, payload);
  }

  updateLog(id: string, payload: UpdateStaffLogDto): Observable<StaffLog> {
    const url = this.buildUrl(`${this.staffLogsPath}/${id}`);
    return this.patch<StaffLog>(url, payload);
  }

  deleteLog(id: string): Observable<void> {
    const url = this.buildUrl(`${this.staffLogsPath}/${id}`);
    return this.delete<void>(url);
  }

  getWeeksForConsumer(consumerId: string): Observable<WeekSummary[]> {
    const url = this.buildUrl(
      `${this.staffLogsPath}/consumer/${consumerId}/weeks`
    );
    return this.get<WeekSummary[]>(url);
  }

  getLatestLogForConsumer(consumerId: string): Observable<StaffLog | null> {
    const url = this.buildUrl(
      `${this.staffLogsPath}/consumer/${consumerId}/latest`
    );
    return this.get<StaffLog | null>(url);
  }

  getLogByServiceDate(
    consumerId: string,
    serviceDate: string
  ): Observable<StaffLog | null> {
    const url = this.buildUrl(
      `${this.staffLogsPath}/consumer/${consumerId}/by-date`
    );
    return this.get<StaffLog | null>(url, { serviceDate });
  }

  loadOrCreateLogForWeek(payload: CreateStaffLogDto): Observable<StaffLog> {
    const url = this.buildUrl(
      `${this.staffLogsPath}/consumer/${payload.consumerId}/load-or-create`
    );
    return this.post<StaffLog>(url, payload);
  }
}
