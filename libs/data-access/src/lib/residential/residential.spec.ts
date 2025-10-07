import { TestBed } from '@angular/core/testing';

import { Residential } from './residential.service';

describe('Residential', () => {
  let service: Residential;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Residential);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
