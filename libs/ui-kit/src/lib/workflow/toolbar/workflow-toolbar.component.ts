import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-workflow-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-toolbar.component.html',
  styleUrls: ['./workflow-toolbar.component.scss'],
})
export class WorkflowToolbarComponent {
  @Input() align: 'start' | 'center' | 'end' | 'between' = 'between';
}