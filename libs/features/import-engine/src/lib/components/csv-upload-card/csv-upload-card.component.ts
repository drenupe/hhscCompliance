import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { ImportTemplate } from '@hhsc-compliance/shared-models';
import { CardComponent } from '@hhsc-compliance/ui-kit';

export interface CsvUploadEvent {
  template: ImportTemplate;
  file: File;
}

@Component({
  selector: 'lib-csv-upload-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './csv-upload-card.component.html',
  styleUrls: ['./csv-upload-card.component.scss'],
})
export class CsvUploadCardComponent {
  @Input({ required: true })
  template!: ImportTemplate;

  @Input()
  disabled = false;

  @Output()
  upload = new EventEmitter<CsvUploadEvent>();

  @Output()
  remove = new EventEmitter<ImportTemplate>();

  @Output()
  downloadTemplate = new EventEmitter<ImportTemplate>();

  get inputId(): string {
    return `csv-upload-${this.template.id}`;
  }

  get buttonLabel(): string {
    if (this.disabled) {
      return 'Processing...';
    }

    return this.template.uploaded ? 'Replace File' : 'Upload CSV';
  }

  get statusClass(): string {
    switch (this.template.requirement) {
      case 'required':
        return 'status status--required';

      case 'recommended':
        return 'status status--recommended';

      case 'optional':
        return 'status status--optional';

      default:
        return 'status';
    }
  }

  onDownloadTemplate(): void {
    if (this.disabled) {
      return;
    }

    this.downloadTemplate.emit(this.template);
  }

  onFileSelected(event: Event): void {
    if (this.disabled) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.upload.emit({
      template: this.template,
      file,
    });

    input.value = '';
  }

  onRemove(): void {
    if (this.disabled || !this.template.uploaded) {
      return;
    }

    this.remove.emit(this.template);
  }
}