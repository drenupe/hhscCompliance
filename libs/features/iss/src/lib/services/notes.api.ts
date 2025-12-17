import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface IssNoteDto {
  id: string;
  date: string; // YYYY-MM-DD
  consumer: string;
  initials?: string;
  location?: string;
  activity?: string;
  comment: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NotesListParams {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  consumer?: string;
  location?: string;
  q?: string;
}

@Injectable({ providedIn: 'root' })
export class NotesApi {
  /**
   * Stubbed in-memory list to unblock build.
   * Replace the internals with HttpClient later.
   */
  private _list: IssNoteDto[] = [];

  /**
   * List notes in a date range with optional filters.
   * For now: naive in-memory filtering.
   */
  list(params: NotesListParams): Observable<IssNoteDto[]> {
    const start = params.start;
    const end = params.end;

    const q = (params.q ?? '').trim().toLowerCase();
    const consumer = params.consumer?.trim();
    const location = params.location?.trim();

    const filtered = this._list.filter(n => {
      // date range (lexicographic works for YYYY-MM-DD)
      if (n.date < start || n.date > end) return false;

      if (consumer && n.consumer !== consumer) return false;
      if (location && (n.location ?? '') !== location) return false;

      if (q) {
        const haystack = [
          n.comment,
          n.activity ?? '',
          n.initials ?? '',
          n.consumer ?? '',
          n.location ?? '',
          ...(n.tags ?? [])
        ]
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    // mimic network latency
    return of(filtered).pipe(delay(50));
  }

  create(note: Omit<IssNoteDto, 'id' | 'createdAt' | 'updatedAt'>): Observable<IssNoteDto> {
    const now = new Date().toISOString();
    const created: IssNoteDto = {
      id: this.makeId(),
      ...note,
      createdAt: now,
      updatedAt: now,
    };

    this._list = [created, ...this._list];
    return of(created).pipe(delay(50));
  }

  update(id: string, patch: Partial<IssNoteDto>): Observable<IssNoteDto> {
    const idx = this._list.findIndex(n => n.id === id);

    if (idx < 0) {
      // Safe fallback (keeps your app from exploding during stub phase)
      const now = new Date().toISOString();
      const fallback: IssNoteDto = {
        id,
        date: patch.date ?? now.slice(0, 10),
        consumer: patch.consumer ?? 'unknown',
        comment: patch.comment ?? '',
        initials: patch.initials,
        location: patch.location,
        activity: patch.activity,
        tags: patch.tags,
        createdAt: patch.createdAt ?? now,
        updatedAt: now,
      };
      return of(fallback).pipe(delay(50));
    }

    const updated: IssNoteDto = {
      ...this._list[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    this._list[idx] = updated;
    return of(updated).pipe(delay(50));
  }

  remove(id: string): Observable<string> {
    this._list = this._list.filter(n => n.id !== id);
    return of(id).pipe(delay(50));
  }

  // ---------- helpers ----------

  private makeId(): string {
    // Prefer crypto.randomUUID when available; otherwise fallback.
    const c = globalThis.crypto as Crypto | undefined;
    if (c?.randomUUID) return c.randomUUID();
    return `n_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
  }
}