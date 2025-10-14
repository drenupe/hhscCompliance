import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceSummaryCard } from './compliance-summary-card';

describe('ComplianceSummaryCard', () => {
  let component: ComplianceSummaryCard;
  let fixture: ComponentFixture<ComplianceSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceSummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceSummaryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
