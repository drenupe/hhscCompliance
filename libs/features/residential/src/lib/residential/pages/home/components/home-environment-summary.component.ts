import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-home-environment-summary',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="summary">
      <div class="card">
        <div class="label">Total Requirements</div>
        <div class="value">{{ total }}</div>
      </div>

      <div class="card compliant">
        <div class="label">Compliant</div>
        <div class="value">{{ compliant }}</div>
      </div>

      <div class="card warning">
        <div class="label">Needs Review</div>
        <div class="value">{{ warning }}</div>
      </div>

      <div class="card critical">
        <div class="label">Non-Compliant</div>
        <div class="value">{{ nonCompliant }}</div>
      </div>
    </div>
  `,
  styles: [`
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }

    .card {
      padding: 14px;
      border-radius: 12px;
      border: 1px solid var(--clr-line);
      background: var(--clr-card);
    }

    .label {
      font-size: 12px;
      color: var(--clr-text-muted);
    }

    .value {
      font-size: 20px;
      font-weight: 700;
      color: var(--clr-text-strong);
      margin-top: 4px;
    }

    .compliant {
      border-color: #22c55e33;
    }

    .warning {
      border-color: #f59e0b33;
    }

    .critical {
      border-color: #ef444433;
    }
  `],
})
export class HomeEnvironmentSummaryComponent {
  @Input() total = 0;
  @Input() compliant = 0;
  @Input() warning = 0;
  @Input() nonCompliant = 0;
}