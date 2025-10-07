import { TestBed } from '@angular/core/testing';

import { Finance } from './finance.service';

describe('Finance', () => {
  let service: Finance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Finance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
