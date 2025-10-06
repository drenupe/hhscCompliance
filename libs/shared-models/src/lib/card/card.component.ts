import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  /**
   * Controls border color and contextual styling.
   * Can be: 'ok' | 'warning' | 'critical'
   */
  @Input() status: 'ok' | 'warning' | 'critical' = 'ok';
}
