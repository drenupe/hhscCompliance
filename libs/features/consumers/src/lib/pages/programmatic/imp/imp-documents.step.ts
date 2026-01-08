import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-imp-documents-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Documents</div>
      <p class="sub">Uploads, signatures, revision history, export packet.</p>
    </section>
  `,
})
export class ImpDocumentsStep {}