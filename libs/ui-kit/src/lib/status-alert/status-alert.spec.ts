import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusAlert } from './status-alert';

describe('StatusAlert', () => {
  let component: StatusAlert;
  let fixture: ComponentFixture<StatusAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusAlert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
