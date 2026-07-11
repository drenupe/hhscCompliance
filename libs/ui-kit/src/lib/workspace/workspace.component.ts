import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-workspace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent {
  @Input()
  maxWidth: 'standard' | 'wide' | 'full' = 'standard';

  @Input()
  padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
}