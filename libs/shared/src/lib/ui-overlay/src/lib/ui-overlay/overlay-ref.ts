// libs/shared/src/lib/ui-overlay/src/lib/overlay/overlay-ref.ts
import { Subject } from 'rxjs';
import { OverlayService } from './overlay.service';

export class OverlayRef<TResult = unknown> {
  private readonly _closed$ = new Subject<TResult | undefined>();
  readonly closed$ = this._closed$.asObservable();

  constructor(
    private readonly service: OverlayService,
    private readonly id: string
  ) {}

  close(result?: TResult): void {
    this.service.close(this.id, result);
  }

  /** internal */
  _notifyClosed(result?: TResult): void {
    this._closed$.next(result);
    this._closed$.complete();
  }
}
