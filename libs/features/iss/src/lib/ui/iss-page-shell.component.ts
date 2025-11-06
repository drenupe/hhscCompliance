import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-iss-page-shell',
  imports: [CommonModule],
  template: `
  <div class="iss-shell">
    <header class="iss-shell__header">
      <div>
        <h1 class="iss-shell__title">{{ title }}</h1>
        <p class="iss-shell__subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <ng-content select="[actions]"></ng-content>
    </header>
    <main class="iss-shell__body">
      <ng-content></ng-content>
    </main>
  </div>
  `,
  styles: [`
    .iss-shell { display:flex; flex-direction:column; gap:1rem; }
    .iss-shell__header {
      display:flex; justify-content:space-between; align-items:center;
      border-bottom:1px solid rgba(0,0,0,.08); padding-bottom:.5rem;
    }
    .iss-shell__title { font-size:1.1rem; font-weight:600; }
    .iss-shell__subtitle { font-size:.8rem; opacity:.7; }
    .iss-shell__body { display:block; }
  `]
})
export class IssPageShellComponent {
  @Input() title = 'ISS';
  @Input() subtitle?: string;
}
