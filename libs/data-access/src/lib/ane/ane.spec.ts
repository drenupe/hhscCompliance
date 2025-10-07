import { TestBed } from '@angular/core/testing';

import { Ane } from './ane.service';

describe('Ane', () => {
  let service: Ane;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ane);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
