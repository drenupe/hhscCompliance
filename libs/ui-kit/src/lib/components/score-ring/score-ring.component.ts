import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-score-ring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-ring.component.html',
  styleUrl: './score-ring.component.scss',
})
export class ScoreRingComponent {
  @Input() value = 0;
  @Input() label = 'Ready';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}