import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplianceRegistry } from './compliance-registry';

describe('ComplianceRegistry', () => {
  let component: ComplianceRegistry;
  let fixture: ComponentFixture<ComplianceRegistry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceRegistry],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplianceRegistry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
