import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, map, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

const skipRefresh = new HttpContextToken<boolean>(() => false);
const authEndpoints = new Set([
  '/api/v1.0/signin',
  '/api/v1.0/signup',
  '/api/v1.0/sign-up',
  '/api/v1.0/refresh'
]);

let refreshInFlight: Observable<string> | null = null;

function requestPath(url: string): string {
  return new URL(url, 'http://localhost').pathname;
}

function isProtectedApiRequest(url: string): boolean {
  const path = requestPath(url);
  return path.startsWith('/api/v1.0/') && !authEndpoints.has(path);
}

function refreshAccessToken(authService: AuthService): Observable<string> {
  if (!refreshInFlight) {
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token is available'));
    }

    refreshInFlight = authService.refresh(refreshToken).pipe(
      map((response) => response.token),
      catchError((error: unknown) => {
        authService.logout();
        return throwError(() => error);
      }),
      finalize(() => {
        refreshInFlight = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }

  return refreshInFlight;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const protectedRequest = isProtectedApiRequest(req.url);
  const token = authService.getToken();
  const authReq = token && protectedRequest
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        !protectedRequest ||
        req.context.get(skipRefresh)
      ) {
        return throwError(() => error);
      }

      if (!authService.getRefreshToken()) {
        authService.logout();
        return throwError(() => error);
      }

      return refreshAccessToken(authService).pipe(
        switchMap((newToken) => next(req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` },
          context: req.context.set(skipRefresh, true)
        })))
      );
    })
  );
};
