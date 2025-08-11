import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Iis } from './iis';

describe('Iis', () => {
  let component: Iis;
  let fixture: ComponentFixture<Iis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Iis],
    }).compileComponents();

    fixture = TestBed.createComponent(Iis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
