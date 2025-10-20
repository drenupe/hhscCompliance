import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CostReport } from './lib';

describe('CostReport', () => {
  let component: CostReport;
  let fixture: ComponentFixture<CostReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostReport]
    }).compileComponents();

    fixture = TestBed.createComponent(CostReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
