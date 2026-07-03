import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { ImportTemplate } from '@hhsc-compliance/shared-models';

@Component({
  selector: 'lib-csv-upload-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './csv-upload-card.component.html',
  styleUrls: ['./csv-upload-card.component.scss'],
})
export class CsvUploadCardComponent {
  @Input({ required: true })
  template!: ImportTemplate;

  @Input()
  disabled = false;

  @Output()
  upload = new EventEmitter<ImportTemplate>();

  @Output()
  remove = new EventEmitter<ImportTemplate>();

  get buttonLabel(): string {
    if (this.disabled) {
      return 'Processing...';
    }

    return this.template.uploaded ? 'Replace File' : 'Upload CSV';
  }

  get statusClass(): string {
    switch (this.template.status) {
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

  onUpload(): void {
    if (this.disabled) {
      return;
    }

    this.upload.emit(this.template);
  }

  onRemove(): void {
    if (this.disabled || !this.template.uploaded) {
      return;
    }

    this.remove.emit(this.template);
  }
}