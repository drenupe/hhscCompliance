import { Component } from '@angular/core';

import { ExecutiveDashboardComponent } from '@hhsc-compliance/operations';

@Component({
  selector: 'lib-provider-workspace',
  standalone: true,
  imports: [ExecutiveDashboardComponent],
  templateUrl: './provider-workspace.component.html',
  styleUrls: ['./provider-workspace.component.scss'],
})
export class ProviderWorkspaceComponent {}