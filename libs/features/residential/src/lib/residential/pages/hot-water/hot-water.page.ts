import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-residential-hot-water-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Hot Water Safety</div>
      <div class="sub">TAC §565.23(c) — temp limit + competency-based assessment (annual) + documentation.</div>
      <div class="msg">Next: add assessment capture + last-documented indicators.</div>
    </section>
  `,
})
export class ResidentialHotWaterPage {}
