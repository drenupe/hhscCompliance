import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Iss } from './iss';

describe('Iss', () => {
  let component: Iss;
  let fixture: ComponentFixture<Iss>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Iss],
    }).compileComponents();

    fixture = TestBed.createComponent(Iss);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
