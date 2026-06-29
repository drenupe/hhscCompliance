import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type StatusChipVariant =
  | 'healthy'
  | 'attention'
  | 'warning'
  | 'critical'
  | 'info'
  | 'neutral';

@Component({
  selector: 'lib-status-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-chip.component.html',
  styleUrl: './status-chip.component.scss',
})
export class StatusChipComponent {
  @Input() label = '';

  @Input()
  variant: StatusChipVariant = 'neutral';
}