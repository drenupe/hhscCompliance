import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { OperationActivity } from '@hhsc-compliance/shared-models';

@Component({
  selector: 'lib-activity-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-feed.component.html',
  styleUrl: './activity-feed.component.scss',
})
export class ActivityFeedComponent {
  @Input() items: OperationActivity[] = [];
}