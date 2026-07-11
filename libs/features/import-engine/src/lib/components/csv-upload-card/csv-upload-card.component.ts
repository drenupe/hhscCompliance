import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
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

  @ViewChild('fileInput')
  fileInput?: ElementRef<HTMLInputElement>;

  get statusLabel(): string {
    if (this.template.uploaded) {
      return 'Uploaded';
    }

    if (this.template.requirement === 'required') {
      return 'Required';
    }

    if (this.template.requirement === 'recommended') {
      return 'Recommended';
    }

    return 'Optional';
  }

  get statusClass(): string {
    if (this.template.uploaded) {
      return 'status status--uploaded';
    }

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

  get uploadLabel(): string {
    if (this.disabled) {
      return 'Processing...';
    }

    return this.template.uploaded ? 'Replace CSV' : 'Upload CSV';
  }

  get recordsLabel(): string {
    const count = this.template.recordsFound ?? 0;
    return count === 1 ? '1 record' : `${count} records`;
  }

  openFilePicker(): void {
    if (this.disabled) {
      return;
    }

    this.fileInput?.nativeElement.click();
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