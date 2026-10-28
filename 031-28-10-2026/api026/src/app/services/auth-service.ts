import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface AuthTokens {
  token: string;
  refreshToken: string;
  role: string;
}

interface SignInResponse extends AuthTokens {
  login: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly signInUrl = '/api/v1.0/signin';
  private readonly refreshUrl = '/api/v1.0/refresh';
  private readonly tokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';

  isLoggedIn = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.isLoggedIn.set(!!this.getToken());
  }

  login(credentials: { userName: string; password: string }): Observable<SignInResponse> {
    const body = new HttpParams()
      .set('userName', credentials.userName)
      .set('password', credentials.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<SignInResponse>(this.signInUrl, body.toString(), { headers }).pipe(
      tap((response) => this.saveTokens(response))
    );
  }

  refresh(refreshToken: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(this.refreshUrl, { refreshToken }).pipe(
      tap((response) => this.saveTokens(response))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private saveTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.tokenKey, tokens.token);
    localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
    this.isLoggedIn.set(true);
  }
}
