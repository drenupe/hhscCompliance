import { TestBed } from '@angular/core/testing';

import { Prohibitions } from './prohibitions.service';

describe('Prohibitions', () => {
  let service: Prohibitions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Prohibitions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
