import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-provider-onboarding-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-onboarding.html',
  styleUrls: ['./provider-onboarding.scss'],
})
export class ProviderOnboardingPage {
  private readonly router = inject(Router);

  progress = 85;

  attentionItems = [
    'Verify RN license',
    'Assign 3 consumers to residential locations',
    'Upload 2 missing service authorizations',
    'Confirm provider contact information',
  ];

  beginAgencySetup(): void {
    this.router.navigate(['/provider-onboarding/agency-creation']);
  }
}