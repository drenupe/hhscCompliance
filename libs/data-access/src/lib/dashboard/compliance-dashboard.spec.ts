import { TestBed } from '@angular/core/testing';

import { ComplianceDashboard } from './compliance-dashboard.service';

describe('ComplianceDashboard', () => {
  let service: ComplianceDashboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplianceDashboard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
