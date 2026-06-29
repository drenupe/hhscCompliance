import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import {
  OperationServiceLine,
  OperationStatus,
} from '@hhsc-compliance/shared-models';

import {
  ButtonComponent,
  ScoreRingComponent,
  StatusChipComponent,
} from '@hhsc-compliance/ui-kit';

@Component({
  selector: 'lib-operations-engine-card',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ScoreRingComponent,
    StatusChipComponent,
  ],
  templateUrl: './operations-engine-card.component.html',
  styleUrl: './operations-engine-card.component.scss',
})
export class OperationsEngineCardComponent implements OnInit, OnDestroy {
  @Input() serviceLines: OperationServiceLine[] = [];

  @Output() open = new EventEmitter<OperationServiceLine>();

  currentServiceLineIndex = 0;

  private rotationTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startRotation();
  }

  ngOnDestroy(): void {
    this.stopRotation();
  }

  activeServiceLine(): OperationServiceLine | null {
    if (!this.serviceLines.length) {
      return null;
    }

    return this.serviceLines[
      this.currentServiceLineIndex % this.serviceLines.length
    ];
  }

  nextServiceLine(): void {
    if (!this.serviceLines.length) {
      return;
    }

    this.currentServiceLineIndex =
      (this.currentServiceLineIndex + 1) % this.serviceLines.length;
  }

  previousServiceLine(): void {
    if (!this.serviceLines.length) {
      return;
    }

    this.currentServiceLineIndex =
      (this.currentServiceLineIndex - 1 + this.serviceLines.length) %
      this.serviceLines.length;
  }

  selectServiceLine(index: number): void {
    this.currentServiceLineIndex = index;
  }

  pauseRotation(): void {
    this.stopRotation();
  }

  resumeRotation(): void {
    this.startRotation();
  }

  openServiceLine(line: OperationServiceLine): void {
    this.open.emit(line);
  }

  statusLabel(status: OperationStatus): string {
    switch (status) {
      case 'HEALTHY':
        return 'Healthy';
      case 'ATTENTION':
        return 'Needs Attention';
      case 'AT_RISK':
        return 'At Risk';
      case 'CRITICAL':
        return 'Critical';
      default:
        return status;
    }
  }

  statusVariant(
    status: OperationStatus,
  ): 'healthy' | 'attention' | 'warning' | 'critical' | 'neutral' {
    switch (status) {
      case 'HEALTHY':
        return 'healthy';
      case 'ATTENTION':
        return 'attention';
      case 'AT_RISK':
        return 'warning';
      case 'CRITICAL':
        return 'critical';
      default:
        return 'neutral';
    }
  }

  private startRotation(): void {
    this.stopRotation();

    this.rotationTimer = setInterval(() => {
      this.currentServiceLineIndex += 1;
    }, 10000);
  }

  private stopRotation(): void {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
      this.rotationTimer = null;
    }
  }
}