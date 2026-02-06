import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-residential-medication-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Medication Practices</div>
      <div class="sub">TAC §565.23(h) — admin/storage policies, training/delegation, documentation.</div>
      <div class="msg">Next: link to medication module evidence + location-level checklist.</div>
    </section>
  `,
})
export class ResidentialMedicationPage {}
