import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Behavior } from './behavior';

describe('Behavior', () => {
  let component: Behavior;
  let fixture: ComponentFixture<Behavior>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Behavior],
    }).compileComponents();

    fixture = TestBed.createComponent(Behavior);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
