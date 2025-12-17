import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { NxWelcome } from './nx-welcome';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, NxWelcome],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should bootstrap without throwing', () => {
    const fixture = TestBed.createComponent(App);

    // If change detection throws, this test fails (good).
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should render the root host element', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // Just verify the component host exists (always true if mounted correctly).
    expect(compiled).toBeTruthy();
  });
});
