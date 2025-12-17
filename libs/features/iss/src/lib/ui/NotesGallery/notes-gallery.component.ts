// libs/iss-compliance/src/lib/ui/NotesGallery/notes-gallery.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IssNotesFacade } from '../../state/ngrx/iss-notes.facade';
import { IssNote } from '../../models/iss-note.model';

const ymd = (d: Date) => d.toISOString().slice(0, 10);

@Component({
  selector: 'lib-iss-notes-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-gallery.component.html',
  styleUrls: ['./notes-gallery.component.scss']
})
export class NotesGalleryComponent {
  private f = inject(IssNotesFacade);

  // Facade streams (used with | async in the template)
  weekNotes$      = this.f.weekNotes$;
  weekAnchor$     = this.f.weekAnchor$;
  filterConsumer$ = this.f.filterConsumer$;
  filterLocation$ = this.f.filterLocation$;
  filterQuery$    = this.f.filterQuery$;
  loading$        = this.f.loading$;

  // UI state for modal
  selected: IssNote | null = null;
  showModal = false;

  // Week controls (effects will auto-load on SetWeekAnchor)
  setPrevWeek(curr: string) { const d = new Date(curr); d.setDate(d.getDate() - 7); this.f.setWeekAnchor(ymd(d)); }
  setNextWeek(curr: string) { const d = new Date(curr); d.setDate(d.getDate() + 7); this.f.setWeekAnchor(ymd(d)); }
  setTodayWeek()            { this.f.setWeekAnchor(ymd(new Date())); }
  setAnchor(a: string)      { this.f.setWeekAnchor(a); }

  // Filters
  setFilterConsumer(v: string) { this.f.setFilterConsumer(v); }
  setFilterLocation(v: string) { this.f.setFilterLocation(v); }
  setFilterQuery(v: string)    { this.f.setFilterQuery(v); }

  // Modal + utilities
  open(note: IssNote) { this.selected = note; this.showModal = true; }
  close()             { this.showModal = false; }
  copy(text: string)  { navigator.clipboard?.writeText(text).catch(() => { /* empty */ }); }

  // PDF export helpers (unchanged; keep your existing implementations)
  async exportPdfList()  { /* same as before */ }
  async exportPdfCards() { /* same as before */ }
}
