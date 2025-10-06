import { TestBed } from '@angular/core/testing';

import { Restraints } from './restraints';

describe('Restraints', () => {
  let service: Restraints;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Restraints);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
