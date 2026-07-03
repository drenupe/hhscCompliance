import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportEngine } from './import-engine';

describe('ImportEngine', () => {
  let component: ImportEngine;
  let fixture: ComponentFixture<ImportEngine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportEngine],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportEngine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
