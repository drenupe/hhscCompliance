import { TestBed } from '@angular/core/testing';

import { ProtectiveDevices } from './protective-devices';

describe('ProtectiveDevices', () => {
  let service: ProtectiveDevices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtectiveDevices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
