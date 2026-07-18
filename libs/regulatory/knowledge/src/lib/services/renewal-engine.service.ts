
import { KnowledgeEngine } from '../interfaces/knowledge-engine.interface';
import { RenewalEngine, RenewalEvaluationRequest, RenewalEvaluationResult } from '../interfaces/renewal-engine.interface';


import { RenewalRule } from '../models/renewal-rule.model';

const MILLISECONDS_PER_DAY = 86_400_000;

export class RenewalEngineService implements RenewalEngine {
  constructor(
    private readonly knowledgeEngine: KnowledgeEngine,
  ) {}

  evaluate(
    request: RenewalEvaluationRequest,
  ): RenewalEvaluationResult[] {
    const rules = this.knowledgeEngine.getRenewal(
      request.requirementId,
    );

    return rules.map((rule) =>
      this.evaluateRule(
        rule,
        request.lastCompletedDate,
        request.asOfDate,
      ),
    );
  }

  evaluateRule(
    rule: RenewalRule,
    lastCompletedDate: string,
    asOfDate?: string,
  ): RenewalEvaluationResult {
    if (!rule.enabled) {
      return {
        requirementId: rule.requirementId,
        renewalRule: rule,
        lastCompletedDate,
        status: 'DISABLED',
        notificationRequired: false,
      };
    }

    const completedDate = this.parseDate(
      lastCompletedDate,
      'lastCompletedDate',
    );

    const evaluationDate = asOfDate
      ? this.parseDate(asOfDate, 'asOfDate')
      : this.startOfDay(new Date());

    const dueDate = this.calculateDueDate(
      completedDate,
      rule,
    );

    const daysRemaining = this.differenceInDays(
      dueDate,
      evaluationDate,
    );

    const matchedReminderDay =
      rule.reminderDaysBefore.find(
        (days) => daysRemaining === days,
      );

    return {
      requirementId: rule.requirementId,
      renewalRule: rule,
      lastCompletedDate:
        this.toDateString(completedDate),
      dueDate: this.toDateString(dueDate),
      daysRemaining,
      status: this.resolveStatus(
        daysRemaining,
        rule.reminderDaysBefore,
      ),
      notificationRequired:
        daysRemaining < 0 ||
        matchedReminderDay !== undefined,
      matchedReminderDay,
    };
  }

  getDueSoon(
    results: RenewalEvaluationResult[],
  ): RenewalEvaluationResult[] {
    return results.filter(
      (result) => result.status === 'DUE_SOON',
    );
  }

  getOverdue(
    results: RenewalEvaluationResult[],
  ): RenewalEvaluationResult[] {
    return results.filter(
      (result) => result.status === 'OVERDUE',
    );
  }

  private calculateDueDate(
    completedDate: Date,
    rule: RenewalRule,
  ): Date {
    const dueDate = new Date(completedDate);

    switch (rule.unit) {
      case 'DAYS':
        dueDate.setUTCDate(
          dueDate.getUTCDate() + rule.interval,
        );
        break;

      case 'MONTHS':
        dueDate.setUTCMonth(
          dueDate.getUTCMonth() + rule.interval,
        );
        break;

      case 'YEARS':
        dueDate.setUTCFullYear(
          dueDate.getUTCFullYear() + rule.interval,
        );
        break;
    }

    return dueDate;
  }

  private resolveStatus(
    daysRemaining: number,
    reminderDays: number[],
  ): RenewalEvaluationResult['status'] {
    if (daysRemaining < 0) {
      return 'OVERDUE';
    }

    const maximumReminderDay =
      reminderDays.length > 0
        ? Math.max(...reminderDays)
        : 0;

    if (daysRemaining <= maximumReminderDay) {
      return 'DUE_SOON';
    }

    return 'CURRENT';
  }

  private parseDate(
    value: string,
    fieldName: string,
  ): Date {
    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new Error(
        `Invalid ${fieldName} "${value}". Expected YYYY-MM-DD.`,
      );
    }

    return date;
  }

  private differenceInDays(
    laterDate: Date,
    earlierDate: Date,
  ): number {
    return Math.ceil(
      (this.startOfDay(laterDate).getTime() -
        this.startOfDay(earlierDate).getTime()) /
        MILLISECONDS_PER_DAY,
    );
  }

  private startOfDay(date: Date): Date {
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
      ),
    );
  }

  private toDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}