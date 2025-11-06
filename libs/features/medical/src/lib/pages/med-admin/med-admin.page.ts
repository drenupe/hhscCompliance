import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-med-admin-page',
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Medication Administration</h1>
      <!-- <app-med-pass-table /> etc -->
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedAdminPage {}
