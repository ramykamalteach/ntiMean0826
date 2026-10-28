import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { authInterceptor } from './auth-interceptor-interceptor';
import { AuthService } from '../services/auth-service';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));
  let httpTesting: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    httpTesting = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('adds the access token to protected API requests', () => {
    localStorage.setItem('access_token', 'access-1');
    const client = TestBed.inject(HttpClient);

    client.get('/api/v1.0/products').subscribe();
    const request = httpTesting.expectOne('/api/v1.0/products');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-1');
    request.flush([]);
  });

  it('shares one refresh request for concurrent 401s and retries both with the rotated token', () => {
    localStorage.setItem('access_token', 'access-old');
    localStorage.setItem('refresh_token', 'refresh-old');
    const client = TestBed.inject(HttpClient);
    const results: unknown[] = [];

    client.get('/api/v1.0/products').subscribe((value) => results.push(value));
    client.get('/api/v1.0/products').subscribe((value) => results.push(value));
    const originalRequests = httpTesting.match('/api/v1.0/products');
    expect(originalRequests).toHaveLength(2);
    originalRequests.forEach((request) => {
      expect(request.request.headers.get('Authorization')).toBe('Bearer access-old');
      request.flush({}, { status: 401, statusText: 'Unauthorized' });
    });

    const refreshRequests = httpTesting.match('/api/v1.0/refresh');
    expect(refreshRequests).toHaveLength(1);
    expect(refreshRequests[0].request.body).toEqual({ refreshToken: 'refresh-old' });
    expect(refreshRequests[0].request.headers.has('Authorization')).toBe(false);
    refreshRequests[0].flush({
      token: 'access-new',
      refreshToken: 'refresh-new',
      role: 'user'
    });

    const retriedRequests = httpTesting.match('/api/v1.0/products');
    expect(retriedRequests).toHaveLength(2);
    retriedRequests.forEach((request) => {
      expect(request.request.headers.get('Authorization')).toBe('Bearer access-new');
      request.flush([]);
    });
    expect(results).toHaveLength(2);
    expect(authService.getRefreshToken()).toBe('refresh-new');
  });

  it('clears authentication and navigates to login when refresh fails', () => {
    localStorage.setItem('access_token', 'access-old');
    localStorage.setItem('refresh_token', 'refresh-old');
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const client = TestBed.inject(HttpClient);
    const errors: unknown[] = [];

    client.get('/api/v1.0/products').subscribe({ error: (error) => errors.push(error) });
    httpTesting.expectOne('/api/v1.0/products')
      .flush({}, { status: 401, statusText: 'Unauthorized' });
    httpTesting.expectOne('/api/v1.0/refresh')
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(errors).toHaveLength(1);
    expect(authService.getToken()).toBeNull();
    expect(authService.getRefreshToken()).toBeNull();
    expect(authService.isLoggedIn()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('does not add auth headers or refresh sign-in, sign-up, or refresh requests', () => {
    localStorage.setItem('access_token', 'access-1');
    const client = TestBed.inject(HttpClient);
    const errors: unknown[] = [];

    for (const endpoint of [
      '/api/v1.0/signin',
      '/api/v1.0/signup',
      '/api/v1.0/refresh'
    ]) {
      client.post(endpoint, {}).subscribe({ error: (error) => errors.push(error) });
      const request = httpTesting.expectOne(endpoint);
      expect(request.request.headers.has('Authorization')).toBe(false);
      request.flush({}, { status: 401, statusText: 'Unauthorized' });
    }

    httpTesting.expectNone('/api/v1.0/refresh');
    expect(errors).toHaveLength(3);
  });
});
