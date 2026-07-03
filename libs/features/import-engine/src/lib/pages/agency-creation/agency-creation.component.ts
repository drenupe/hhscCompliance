import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SetupMethod, SetupMethodType } from '@hhsc-compliance/shared-models';

@Component({
  selector: 'lib-agency-creation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agency-creation.component.html',
  styleUrls: ['./agency-creation.component.scss'],
})
export class AgencyCreationComponent {
  private readonly router = inject(Router);
  selectedMethod: SetupMethodType = 'import';

  readonly setupMethods: SetupMethod[] = [
    {
      type: 'import',
      title: 'Import What You Already Have',
      badge: 'Recommended',
      description:
        'Upload existing CSV files and let the platform build most of your agency automatically. You can manually complete anything missing afterward.',
      bullets: [
        'Best for providers with Excel or exported records',
        'Supports employees, consumers, locations, training, and authorizations',
        'AI validation will identify missing or incomplete data',
      ],
      cta: 'Start Import',
    },
    {
      type: 'manual',
      title: 'Build Agency Manually',
      description:
        'Use a guided setup process to enter your agency information step by step.',
      bullets: [
        'Best for new providers',
        'No spreadsheet required',
        'The system guides every required setup step',
      ],
      cta: 'Start Manual Setup',
    },
    {
      type: 'customer-success',
      title: 'Schedule Customer Success',
      description:
        'Work with our onboarding team if your records are mostly paper or need help being organized.',
      bullets: [
        'Best for paper records or mixed records',
        'Customer Success helps prepare your import',
        'You can still upload files later',
      ],
      cta: 'Schedule Help',
    },
  ];
  selectMethod(type: SetupMethodType): void {
    this.selectedMethod = type;
  }
  continueToImport(): void {
    this.router.navigate(['/provider-onboarding/agency-creation/csv-import']);
  }
}