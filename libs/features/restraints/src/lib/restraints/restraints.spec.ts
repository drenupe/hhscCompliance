import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Restraints } from './restraints';

describe('Restraints', () => {
  let component: Restraints;
  let fixture: ComponentFixture<Restraints>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Restraints],
    }).compileComponents();

    fixture = TestBed.createComponent(Restraints);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
