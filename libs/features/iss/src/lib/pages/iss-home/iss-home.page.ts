import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

import { Consumer } from '@hhsc-compliance/shared-models';
import { IssFacade } from '@hhsc-compliance/data-access';

@Component({
  standalone: true,
  selector: 'lib-hhsc-iss-home-page',
  imports: [RouterModule, NgIf, NgForOf, AsyncPipe],
  templateUrl: './iss-home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssHomePage implements OnInit {
  private readonly issFacade = inject(IssFacade);
  private readonly router = inject(Router);

  consumers$!: Observable<Consumer[]>;

  // TODO: eventually pull provider from auth/context
  readonly providerId = 'ellis-works';

  ngOnInit(): void {
    this.consumers$ = this.issFacade.consumers$;
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
    ]);
  }
}
