import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Medicals } from './medicals';

describe('Medicals', () => {
  let component: Medicals;
  let fixture: ComponentFixture<Medicals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Medicals],
    }).compileComponents();

    fixture = TestBed.createComponent(Medicals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
