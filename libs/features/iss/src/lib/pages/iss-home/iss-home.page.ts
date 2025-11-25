// libs/features/iss/src/lib/pages/iss-home/iss-home.page.ts
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, AsyncPipe, NgForOf, NgIf } from '@angular/common';

import { Observable } from 'rxjs';

import { Consumer } from '@hhsc-compliance/shared-models';
import { IssFacade } from '@hhsc-compliance/data-access';

@Component({
  standalone: true,
  selector: 'lib-hhsc-iss-home-page',
  imports: [CommonModule, RouterModule, NgIf, NgForOf, AsyncPipe],
  templateUrl: './iss-home.page.html',
  styleUrls: ['./iss-home.page.scss'],
  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssHomePage implements OnInit {
  /**
   * Stream of ISS consumers displayed as cards.
   */
  readonly consumers$: Observable<Consumer[]> =
    inject(IssFacade).consumers$;

  // TODO: eventually pull providerId from auth/context
  readonly providerId = 'ellis-works';

  private readonly issFacade = inject(IssFacade);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // kick off load when page mounts
    this.issFacade.loadConsumers();
  }

  openConsumer(consumer: Consumer): void {
    this.issFacade.selectConsumer(consumer.id);

    this.router.navigate([
      '/iss',
      'provider',
      this.providerId,
      'consumer',
      consumer.id,
      'year',
    ]);
  }

  trackByConsumerId(_: number, c: Consumer): number {
    return c.id; // numeric id (matches shared-models + API)
  }
}
