import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Prohibitions } from './prohibitions';

describe('Prohibitions', () => {
  let component: Prohibitions;
  let fixture: ComponentFixture<Prohibitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prohibitions],
    }).compileComponents();

    fixture = TestBed.createComponent(Prohibitions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
