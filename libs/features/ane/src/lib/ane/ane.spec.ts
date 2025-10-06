import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ane } from './ane';

describe('Ane', () => {
  let component: Ane;
  let fixture: ComponentFixture<Ane>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ane],
    }).compileComponents();

    fixture = TestBed.createComponent(Ane);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
