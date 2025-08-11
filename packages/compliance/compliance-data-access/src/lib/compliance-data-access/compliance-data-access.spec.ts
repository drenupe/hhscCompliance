import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplianceDataAccess } from './compliance-data-access';

describe('ComplianceDataAccess', () => {
  let component: ComplianceDataAccess;
  let fixture: ComponentFixture<ComplianceDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplianceDataAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
