import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth-service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stores both tokens after sign-in', () => {
    service.login({ userName: 'user', password: 'pass' }).subscribe();
    const request = httpTesting.expectOne('/api/v1.0/signin');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBe('userName=user&password=pass');

    request.flush({
      login: 'done',
      token: 'access-1',
      refreshToken: 'refresh-1',
      role: 'user'
    });

    expect(service.getToken()).toBe('access-1');
    expect(service.getRefreshToken()).toBe('refresh-1');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('posts the refresh token and replaces both saved tokens after rotation', () => {
    localStorage.setItem('access_token', 'access-old');
    localStorage.setItem('refresh_token', 'refresh-old');

    service.refresh('refresh-old').subscribe();
    const request = httpTesting.expectOne('/api/v1.0/refresh');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ refreshToken: 'refresh-old' });

    request.flush({
      token: 'access-new',
      refreshToken: 'refresh-new',
      role: 'user'
    });

    expect(service.getToken()).toBe('access-new');
    expect(service.getRefreshToken()).toBe('refresh-new');
  });
});
