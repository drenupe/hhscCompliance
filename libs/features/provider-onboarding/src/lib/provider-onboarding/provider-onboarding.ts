import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface SetupOption {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'lib-provider-onboarding-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-onboarding.html',
  styleUrls: ['./provider-onboarding.scss'],
})
export class ProviderOnboardingPage {
  progress = 85;

  setupOptions: SetupOption[] = [
    {
      icon: '📁',
      title: 'I already have electronic records',
      description:
        'Upload formatted CSV templates and let the platform build your agency automatically.',
    },
    {
      icon: '📄',
      title: 'I have paper records',
      description:
        'We will guide you through setup with help from Customer Success.',
    },
    {
      icon: '✨',
      title: "I'm a new provider",
      description:
        'We will build your agency from scratch using a guided setup process.',
    },
  ];

  csvTemplates = [
    'Provider Information',
    'Employees',
    'Consumers',
    'Residential Locations',
    'Authorizations',
    'Training Records',
  ];

  attentionItems = [
    'Verify RN license',
    'Assign 3 consumers to residential locations',
    'Upload 2 missing service authorizations',
    'Confirm provider contact information',
  ];
}