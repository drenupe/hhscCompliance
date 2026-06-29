import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationsCommandCenterView } from '../types/operations.types';


@Injectable({
  providedIn: 'root',
})
export class OperationsService {
  private readonly http = inject(HttpClient);

  getCommandCenter(): Observable<OperationsCommandCenterView> {
    return this.http.get<OperationsCommandCenterView>(
      '/api/v1/operations/command-center',
    );
  }
}