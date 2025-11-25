import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe, NgForOf, NgIf, CommonModule } from '@angular/common';
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
  consumers$!: Observable<Consumer[]>;

  // TODO: eventually pull provider from auth/context
  readonly providerId = 'ellis-works';

  private readonly issFacade = inject(IssFacade);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.consumers$ = this.issFacade.consumers$;
    this.issFacade.loadConsumers();
  }

  openConsumer(consumer: Consumer): void {
    this.issFacade.selectConsumer(consumer.id);

    // ✅ Go straight to the YEAR view
    this.router.navigate([
      '/iss',
      'provider',
      this.providerId,
      'consumer',
      consumer.id,
      'year',
    ]);
  }

  trackByConsumerId(_: number, c: Consumer): string {
    return c.id;
  }
}
