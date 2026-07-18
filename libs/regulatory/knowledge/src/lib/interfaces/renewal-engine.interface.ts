import { RenewalRule } from "../models/renewal-rule.model";

/**
 * Current status of a renewal requirement.
 */
export type RenewalStatus =
  | 'CURRENT'
  | 'DUE_SOON'
  | 'OVERDUE'
  | 'DISABLED';

/**
 * Request to evaluate renewals for a requirement.
 */
export interface RenewalEvaluationRequest {
  /**
   * Regulatory requirement to evaluate.
   */
  requirementId: string;

  /**
   * Date the requirement was last completed.
   * Format: YYYY-MM-DD
   */
  lastCompletedDate: string;

  /**
   * Evaluation date.
   * Defaults to today.
   * Format: YYYY-MM-DD
   */
  asOfDate?: string;
}

/**
 * Result returned after evaluating a renewal rule.
 */
export interface RenewalEvaluationResult {
  requirementId: string;

  renewalRule: RenewalRule;

  lastCompletedDate: string;

  dueDate?: string;

  daysRemaining?: number;

  status: RenewalStatus;

  notificationRequired: boolean;

  /**
   * If today matches one of the configured reminder days,
   * this contains the matched value.
   */
  matchedReminderDay?: number;
}

/**
 * Public contract for the Renewal Engine.
 *
 * The Renewal Engine is responsible only for evaluating
 * renewal schedules. It does NOT send notifications or
 * persist renewal history.
 */
export interface RenewalEngine {
  /**
   * Evaluate every renewal rule attached to a requirement.
   */
  evaluate(
    request: RenewalEvaluationRequest,
  ): RenewalEvaluationResult[];

  /**
   * Evaluate a single renewal rule.
   */
  evaluateRule(
    rule: RenewalRule,
    lastCompletedDate: string,
    asOfDate?: string,
  ): RenewalEvaluationResult;

  /**
   * Return renewals currently in the reminder window.
   */
  getDueSoon(
    results: RenewalEvaluationResult[],
  ): RenewalEvaluationResult[];

  /**
   * Return expired renewals.
   */
  getOverdue(
    results: RenewalEvaluationResult[],
  ): RenewalEvaluationResult[];
}