import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Behaviors } from './behaviors';

describe('Behaviors', () => {
  let component: Behaviors;
  let fixture: ComponentFixture<Behaviors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Behaviors],
    }).compileComponents();

    fixture = TestBed.createComponent(Behaviors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
