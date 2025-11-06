import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-nursing-page',
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Nursing</h1>
      <!-- containers call services, render child components -->
      <!-- <app-vitals-card /> etc -->
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NursingPage {}
