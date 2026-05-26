import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../api-core/base-api.service';

import {
  CreateHomeEnvironmentEvidenceInput,
  HomeEnvironmentEvidenceRecord,
  HomeEnvironmentRequirementReview,
  HomeEnvironmentRuleCode,
  UpsertHomeEnvironmentReviewInput,
} from '@hhsc-compliance/shared-models';

@Injectable({ providedIn: 'root' })
export class HomeEnvironmentApi extends BaseApiService {
  /**
   * Maps to:
   * /api/v1/residential/home-environment
   */
  private readonly path = 'v1/residential/home-environment';

  // =========================================================
  // Requirement Reviews
  // =========================================================

  /**
   * GET /api/v1/residential/home-environment/location/:locationId/reviews
   */
  listReviews(
    locationId: string,
  ): Observable<HomeEnvironmentRequirementReview[]> {
    const url = this.buildUrl(
      `${this.path}/location/${locationId}/reviews`,
    );

    return this.get<HomeEnvironmentRequirementReview[]>(url);
  }

  /**
   * GET /api/v1/residential/home-environment/location/:locationId/reviews/:ruleCode
   */
  getReview(
    locationId: string,
    ruleCode: HomeEnvironmentRuleCode,
  ): Observable<HomeEnvironmentRequirementReview> {
    const url = this.buildUrl(
      `${this.path}/location/${locationId}/reviews/${encodeURIComponent(ruleCode)}`,
    );

    return this.get<HomeEnvironmentRequirementReview>(url);
  }

  /**
   * PUT /api/v1/residential/home-environment/location/:locationId/reviews/:ruleCode
   */
  upsertReview(
    payload: UpsertHomeEnvironmentReviewInput,
  ): Observable<HomeEnvironmentRequirementReview> {
    const url = this.buildUrl(
      `${this.path}/location/${payload.locationId}/reviews/${encodeURIComponent(payload.ruleCode)}`,
    );

    return this.patch<HomeEnvironmentRequirementReview>(url, payload);
  }

  // =========================================================
  // Evidence / Logs
  // =========================================================

  /**
   * GET /api/v1/residential/home-environment/location/:locationId/evidence
   */
  listEvidence(
    locationId: string,
  ): Observable<HomeEnvironmentEvidenceRecord[]> {
    const url = this.buildUrl(
      `${this.path}/location/${locationId}/evidence`,
    );

    return this.get<HomeEnvironmentEvidenceRecord[]>(url);
  }

  /**
   * GET /api/v1/residential/home-environment/location/:locationId/evidence/:ruleCode
   */
  listEvidenceForRule(
    locationId: string,
    ruleCode: HomeEnvironmentRuleCode,
  ): Observable<HomeEnvironmentEvidenceRecord[]> {
    const url = this.buildUrl(
      `${this.path}/location/${locationId}/evidence/${encodeURIComponent(ruleCode)}`,
    );

    return this.get<HomeEnvironmentEvidenceRecord[]>(url);
  }

  /**
   * POST /api/v1/residential/home-environment/location/:locationId/evidence
   */
  createEvidence(
    payload: CreateHomeEnvironmentEvidenceInput,
  ): Observable<HomeEnvironmentEvidenceRecord> {
    const url = this.buildUrl(
      `${this.path}/location/${payload.locationId}/evidence`,
    );

    return this.post<HomeEnvironmentEvidenceRecord>(url, payload);
  }

  /**
   * DELETE /api/v1/residential/home-environment/location/:locationId/evidence/:id
   */
  removeEvidence(
    locationId: string,
    id: string,
  ): Observable<{ id: string }> {
    const url = this.buildUrl(
      `${this.path}/location/${locationId}/evidence/${id}`,
    );

    return this.delete<{ id: string }>(url);
  }

  // =========================================================
  // Backward-compatible aliases
  // =========================================================

  getLocationRequirements(
    locationId: string,
  ): Observable<HomeEnvironmentRequirementReview[]> {
    return this.listReviews(locationId);
  }

  updateRequirement(
    _id: string,
    payload: UpsertHomeEnvironmentReviewInput,
  ): Observable<HomeEnvironmentRequirementReview> {
    return this.upsertReview(payload);
  }

  getEvidence(
    locationId: string,
  ): Observable<HomeEnvironmentEvidenceRecord[]> {
    return this.listEvidence(locationId);
  }
}