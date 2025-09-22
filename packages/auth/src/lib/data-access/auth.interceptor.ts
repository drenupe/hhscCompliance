import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { TokenStore } from './token-store.service';

/** Adjust if your API is mounted elsewhere. Keep /api if you use a dev proxy. */
const API_PREFIX = '/api';
const LOGIN_URL = `${API_PREFIX}/auth/login`;
const REFRESH_URL = `${API_PREFIX}/auth/refresh`;

/** Endpoints that must NOT trigger refresh logic. */
const SKIP_REFRESH_URLS = [LOGIN_URL, REFRESH_URL];

/** Add this header with any value to bypass adding auth/refresh for a request. */
const BYPASS_HEADER = 'X-Skip-Auth-Interceptor';

/** Single-flight refresh state shared across requests. */
let refreshing = false;
const refreshed$ = new BehaviorSubject<string | null>(null);

export interface RefreshResponse {
  accessToken: string;
  // refreshToken?: string; // if you also send it in body; usually you use cookie
}

/**
 * Angular v16+ functional interceptor
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const store = inject(TokenStore);
  const http = inject(HttpClient);

  // Allow explicit bypass for public endpoints
  if (req.headers.has(BYPASS_HEADER)) {
    const stripped = req.clone({ headers: req.headers.delete(BYPASS_HEADER) });
    return next(stripped);
  }

  // Attach bearer if we have a token
  let request = attachBearer(req, store.getAccessToken());

  // Proactive refresh: if token is expiring soon, refresh before sending (skip auth endpoints)
  if (!shouldSkipRefresh(request.url) && store.hasToken() && store.isExpired(10)) {
    return refreshToken(http, store).pipe(
      // ignore refresh errors here (we'll still try the request; 401 will be handled below)
      catchError(() => of(null)),
      switchMap((newToken) => {
        request = attachBearer(req, newToken ?? store.getAccessToken());
        return next(request).pipe(catchError(err => handleIf401(err, request, next, http, store)));
      })
    );
  }

  // Normal path: send request; on 401, try a refresh once and retry
  return next(request).pipe(catchError(err => handleIf401(err, request, next, http, store)));
};

// -------------------- helpers --------------------

function handleIf401(
  err: any,
  originalReq: HttpRequest<unknown>,
  next: HttpHandlerFn,
  http: HttpClient,
  store: TokenStore
): Observable<HttpEvent<unknown>> {
  if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
    return throwError(() => err);
  }
  if (shouldSkipRefresh(originalReq.url)) {
    return throwError(() => err);
  }
  return handle401(originalReq, next, http, store);
}

function attachBearer<T>(req: HttpRequest<T>, token: string | null): HttpRequest<T> {
  if (!token) return req;
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function shouldSkipRefresh(url: string): boolean {
  // Basic check; adjust if you call absolute URLs to other domains
  return SKIP_REFRESH_URLS.some((u) => url.includes(u));
}

/** Single-flight refresh with cookie; other requests wait for the result. */
function refreshToken(http: HttpClient, store: TokenStore): Observable<string> {
  if (refreshing) {
    return refreshed$.pipe(filter((t): t is string => t !== null), take(1));
  }

  refreshing = true;
  refreshed$.next(null);

  return http.post<RefreshResponse>(REFRESH_URL, {}, { withCredentials: true }).pipe(
    switchMap(({ accessToken }) => {
      store.setAccessToken(accessToken);
      refreshed$.next(accessToken);
      return of(accessToken);
    }),
    finalize(() => {
      refreshing = false;
    })
  );
}

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  http: HttpClient,
  store: TokenStore
): Observable<HttpEvent<unknown>> {
  return refreshToken(http, store).pipe(
    switchMap((token) => next(attachBearer(req, token))),
    catchError((refreshErr) => {
      // Refresh failed: wipe token and bubble the original 401
      store.clear();
      return throwError(() => refreshErr);
    })
  );
}
