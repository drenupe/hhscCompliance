import { TestBed } from '@angular/core/testing';

import { AuthHttp } from './auth-http';

describe('AuthHttp', () => {
  let service: AuthHttp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthHttp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
