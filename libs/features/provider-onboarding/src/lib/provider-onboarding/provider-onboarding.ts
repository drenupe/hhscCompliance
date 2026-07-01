import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'lib-provider-onboarding-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-onboarding.html',
  styleUrls: ['./provider-onboarding.scss'],
})
export class ProviderOnboardingPage {
  progress = 85;

  attentionItems = [
    'Verify RN license',
    'Assign 3 consumers to residential locations',
    'Upload 2 missing service authorizations',
    'Confirm provider contact information',
  ];
}