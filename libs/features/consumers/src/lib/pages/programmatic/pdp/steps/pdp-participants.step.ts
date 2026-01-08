import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-pdp-participants-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Participants</div>
      <p class="sub">Placeholder — add team/IDT members, signatures, attendance.</p>
    </section>
  `,
})
export class PdpParticipantsStep {}