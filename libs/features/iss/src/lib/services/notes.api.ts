import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface IssNoteDto {
  id: string;
  date: string;      // YYYY-MM-DD
  consumer: string;
  initials?: string;
  location?: string;
  activity?: string;
  comment: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class NotesApi {
  // stubbed in-memory list to unblock build; replace with HttpClient later
  private _list: IssNoteDto[] = [];

  list(params: { start: string; end: string; consumer?: string; location?: string; q?: string }): Observable<IssNoteDto[]> {
    // naive filter – replace with real API call
    return of(this._list).pipe(delay(50));
  }

  create(note: Omit<IssNoteDto, 'id' | 'createdAt' | 'updatedAt'>): Observable<IssNoteDto> {
    const now = new Date().toISOString();
    const created: IssNoteDto = { id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2), ...note, createdAt: now, updatedAt: now };
    this._list = [created, ...this._list];
    return of(created).pipe(delay(50));
  }

  update(id: string, patch: Partial<IssNoteDto>): Observable<IssNoteDto> {
    const idx = this._list.findIndex(n => n.id === id);
    if (idx >= 0) {
      const updated = { ...this._list[idx], ...patch, updatedAt: new Date().toISOString() };
      this._list[idx] = updated;
      return of(updated).pipe(delay(50));
    }
    return of(patch as IssNoteDto).pipe(delay(50));
  }

  remove(id: string): Observable<string> {
    this._list = this._list.filter(n => n.id !== id);
    return of(id).pipe(delay(50));
  }
}
