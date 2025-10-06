import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnclosedBeds } from './enclosed-beds';

describe('EnclosedBeds', () => {
  let component: EnclosedBeds;
  let fixture: ComponentFixture<EnclosedBeds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnclosedBeds],
    }).compileComponents();

    fixture = TestBed.createComponent(EnclosedBeds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
