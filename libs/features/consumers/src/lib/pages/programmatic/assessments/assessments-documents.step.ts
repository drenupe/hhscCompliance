import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-assessments-documents-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Assessment Documents</div>
      <p class="sub">Upload/attach assessments, signatures, and exports.</p>
    </section>
  `,
})
export class AssessmentsDocumentsStep {}