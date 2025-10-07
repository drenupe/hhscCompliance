import { TestBed } from '@angular/core/testing';

import { Programmatic } from './programmatic.service';

describe('Programmatic', () => {
  let service: Programmatic;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Programmatic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
