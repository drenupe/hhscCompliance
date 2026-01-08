import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-pdp-documents-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Documents</div>
      <p class="sub">Placeholder — upload/attach PDP docs, revisions, exports.</p>
    </section>
  `,
})
export class PdpDocumentsStep {}