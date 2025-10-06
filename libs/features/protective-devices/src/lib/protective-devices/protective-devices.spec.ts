import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProtectiveDevices } from './protective-devices';

describe('ProtectiveDevices', () => {
  let component: ProtectiveDevices;
  let fixture: ComponentFixture<ProtectiveDevices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtectiveDevices],
    }).compileComponents();

    fixture = TestBed.createComponent(ProtectiveDevices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
