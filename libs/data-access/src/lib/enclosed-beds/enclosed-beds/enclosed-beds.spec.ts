import { TestBed } from '@angular/core/testing';

import { EnclosedBeds } from './enclosed-beds';

describe('EnclosedBeds', () => {
  let service: EnclosedBeds;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnclosedBeds);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
