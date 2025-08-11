import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplianceUi } from './compliance-ui';

describe('ComplianceUi', () => {
  let component: ComplianceUi;
  let fixture: ComponentFixture<ComplianceUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceUi],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplianceUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
