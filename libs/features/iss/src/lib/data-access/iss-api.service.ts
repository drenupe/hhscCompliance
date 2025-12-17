// libs/features/iss/src/lib/data-access/iss-api.service.ts

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ConsumerDto,
  ConsumerWithLatestLogResponse,
  CreateIssStaffLogRequest,
  GetLogForDateResponse,
  IssProviderDto,
  IssStaffLogDto,
  UpdateIssStaffLogRequest,
  WeeksListResponse,
} from './iss-api.models';

@Injectable({ providedIn: 'root' })
export class IssApiService {
  /**
   * Adjust this if your API is mounted somewhere else.
   * Right now it assumes Nest is serving at /api and global prefix 'v1'.
   */
  private readonly baseUrl = '/api/v1/iss';

  private readonly http = inject(HttpClient);


  // ---------- Providers ----------

  getProviders(): Observable<IssProviderDto[]> {
    return this.http.get<IssProviderDto[]>(`${this.baseUrl}/providers`);
  }

  getProviderById(id: number): Observable<IssProviderDto> {
    return this.http.get<IssProviderDto>(`${this.baseUrl}/providers/${id}`);
  }

  // ---------- Consumers (via ISS) ----------

  /**
   * List consumers for a given ISS provider.
   * Backend: GET /v1/iss/consumers?issProviderId=1
   */
  getConsumersByProvider(issProviderId: number): Observable<ConsumerDto[]> {
    const params = new HttpParams().set('issProviderId', issProviderId);
    return this.http.get<ConsumerDto[]>(`${this.baseUrl}/consumers`, {
      params,
    });
  }

  // ---------- Staff Logs (8615) ----------

  /**
   * Create a new ISS staff log.
   * Backend: POST /v1/iss/staff-logs
   */
  createStaffLog(
    payload: CreateIssStaffLogRequest,
  ): Observable<IssStaffLogDto> {
    return this.http.post<IssStaffLogDto>(
      `${this.baseUrl}/staff-logs`,
      payload,
    );
  }

  /**
   * Update an existing staff log.
   * Backend: PATCH /v1/iss/staff-logs/:id
   */
  updateStaffLog(
    id: number,
    payload: UpdateIssStaffLogRequest,
  ): Observable<IssStaffLogDto> {
    return this.http.patch<IssStaffLogDto>(
      `${this.baseUrl}/staff-logs/${id}`,
      payload,
    );
  }

  /**
   * List all logs for a consumer (you may later add paging on the backend).
   * Backend: GET /v1/iss/staff-logs/:consumerId
   */
  getStaffLogsForConsumer(
    consumerId: number,
  ): Observable<IssStaffLogDto[]> {
    return this.http.get<IssStaffLogDto[]>(
      `${this.baseUrl}/staff-logs/${consumerId}`,
    );
  }

  /**
   * Get consumer + most recent log (any date).
   * Backend: GET /v1/iss/consumer/:id/latest-log
   */
  getConsumerWithLatestLog(
    consumerId: number,
  ): Observable<ConsumerWithLatestLogResponse> {
    return this.http.get<ConsumerWithLatestLogResponse>(
      `${this.baseUrl}/consumer/${consumerId}/latest-log`,
    );
  }

  /**
   * Get consumer + log for a specific week (or a default template if none yet).
   * Backend: GET /v1/iss/consumer/:id/log?date=YYYY-MM-DD
   */
  getLogForConsumerAndDate(
    consumerId: number,
    dateIso?: string,
  ): Observable<GetLogForDateResponse> {
    let params = new HttpParams();
    if (dateIso) {
      params = params.set('date', dateIso);
    }

    return this.http.get<GetLogForDateResponse>(
      `${this.baseUrl}/consumer/${consumerId}/log`,
      { params },
    );
  }

  /**
   * List weeks for a consumer, paginated.
   * Backend: GET /v1/iss/consumer/:id/weeks?page=1&limit=52
   */
  listWeeksForConsumer(
    consumerId: number,
    page = 1,
    limit = 52,
  ): Observable<WeeksListResponse> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    return this.http.get<WeeksListResponse>(
      `${this.baseUrl}/consumer/${consumerId}/weeks`,
      { params },
    );
  }
}
