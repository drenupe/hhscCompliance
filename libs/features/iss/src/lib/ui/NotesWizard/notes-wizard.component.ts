import { Component, EventEmitter, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IssNotesFacade } from '../../state/ngrx/iss-notes.facade';

type Setting = 'on_site' | 'off_site';
type Prompts = 'independent' | 'minimal' | 'moderate' | 'maximal';
type Behavior = 'appropriate' | 'redirected' | 'escalated' | 'other';

@Component({
  selector: 'lib-iss-notes-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notes-wizard.component.html'
})
export class NotesWizardComponent {
  private fb = inject(FormBuilder);
  private facade = inject(IssNotesFacade);

  @Output() commentReady = new EventEmitter<string>();
  @Output() noteReady = new EventEmitter<{
    date: string;
    consumer: string;
    initials?: string;
    location?: string;
    activity?: string;
    comment: string;
  }>();

  // Reactive form
  form = this.fb.group({
    setting: this.fb.control<Setting>('off_site', { nonNullable: true }),
    location: this.fb.control<string>('Sports Bar', { validators: [Validators.required], nonNullable: true }),
    activity: this.fb.control<string>('Pro sports viewing', { validators: [Validators.required], nonNullable: true }),
    prompts: this.fb.control<Prompts>('minimal', { nonNullable: true }),
    behavior: this.fb.control<Behavior>('appropriate', { nonNullable: true }),
    // simple goal flags; convert to list when composing narrative
    goals: this.fb.group({
      communityIntegration: this.fb.control<boolean>(true, { nonNullable: true }),
      peerEngagement: this.fb.control<boolean>(true, { nonNullable: true }),
      communication: this.fb.control<boolean>(true, { nonNullable: true }),
      safety: this.fb.control<boolean>(true, { nonNullable: true }),
    }),
    start: this.fb.control<string>('09:00', { validators: [Validators.required], nonNullable: true }),
    end:   this.fb.control<string>('15:00', { validators: [Validators.required], nonNullable: true }),
  });

  // Optional default for the Save button; you can pass consumer dynamically too
  defaultConsumer = 'James Harris';
  defaultInitials = 'AM';

  // expose a signal for the form value (for clean computed narrative)
  private formValue = signal(this.form.getRawValue());
  // keep signal in sync with form changes
  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.formValue.set(this.form.getRawValue());
    });
  }

  // helpers
  private minutesBetween(start: string, end: string): number {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
  }

  private selectedGoals(): string[] {
    const g = this.formValue().goals;
    const list: string[] = [];
    if (g?.communityIntegration) list.push('community integration');
    if (g?.peerEngagement)      list.push('peer engagement');
    if (g?.communication)       list.push('communication');
    if (g?.safety)              list.push('safety');
    return list;
    }

  // comment composed as a computed signal for instant UI preview
  comment = computed(() => {
    const v = this.formValue();
    const where = v.setting === 'off_site' ? 'off-site community integration' : 'on-site skills session';

    const promptsPhrase: Record<Prompts, string> = {
      independent: 'independently',
      minimal: 'with minimal verbal prompts',
      moderate: 'with moderate prompting',
      maximal: 'with maximal assistance',
    };

    const behaviorPhrase: Record<Behavior, string> = {
      appropriate: 'Demonstrated appropriate community behavior',
      redirected:  'Required redirection to maintain appropriate behavior',
      escalated:   'Exhibited escalated behavior requiring staff intervention',
      other:       'Behavioral notes recorded',
    };

    const goals = this.selectedGoals();
    const dur = this.minutesBetween(v.start, v.end);

    return `Participant engaged in structured ${where} at ${v.location}. ` +
           `Activities included ${v.activity}. ` +
           `${behaviorPhrase[v.behavior]}, ${promptsPhrase[v.prompts]}, and interacted positively with peers. ` +
           `Goals of ${goals.join(', ')} were addressed. ` +
           `Participant remained engaged for the full ${dur}-minute service period (${v.start}–${v.end}).`;
  });

  // actions
  copyNarrative() {
    const text = this.comment();
    navigator.clipboard?.writeText(text).catch(() => { /* empty */ });
    this.commentReady.emit(text);
  }

  saveFor(consumer: string) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.formValue();
    const note = {
      date: new Date().toISOString().slice(0, 10),
      consumer,
      initials: this.defaultInitials,
      location: v.location,
      activity: v.activity,
      comment: this.comment(),
    };
    this.noteReady.emit(note);
    this.facade.create(note); // persist via NgRx/effect
  }
}
