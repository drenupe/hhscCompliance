// libs/shared/src/lib/ui-overlay/src/lib/overlay/overlay-ref.ts

import { OverlayService } from './overlay.service';

export class OverlayRef {
  constructor(
    private readonly service: OverlayService,
    private readonly id: string
  ) {}

  close(): void {
    this.service.close(this.id);
  }
}
