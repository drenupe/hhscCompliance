import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type CardAppearance = 'elevated' | 'outlined' | 'filled' | 'ghost';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardRadius = 'sm' | 'md' | 'lg' | 'xl';
export type CardDensity = 'compact' | 'comfortable';

@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() appearance: CardAppearance = 'elevated';
  @Input() padding: CardPadding = 'md';
  @Input() radius: CardRadius = 'lg';
  @Input() density: CardDensity = 'comfortable';
  @Input() interactive = false;
  @Input() fullHeight = false;

  get classes(): string[] {
    return [
      'card',
      `card--${this.appearance}`,
      `card--padding-${this.padding}`,
      `card--radius-${this.radius}`,
      `card--density-${this.density}`,
      this.interactive ? 'card--interactive' : '',
      this.fullHeight ? 'card--full-height' : '',
    ].filter(Boolean);
  }
}