import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should hide the preloader after rendering the app', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#spinner')?.classList.contains('show')).toBe(false);
  });

  it('should toggle the user dropdown when clicked', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = Array.from(compiled.querySelectorAll<HTMLAnchorElement>('.dropdown-toggle')).find(
      (element) => element.textContent?.includes('John Doe'),
    );
    const menu = Array.from(compiled.querySelectorAll('.dropdown-menu')).find(
      (element) => element.previousElementSibling?.textContent?.includes('John Doe'),
    );

    expect(toggle).toBeTruthy();
    expect(menu).toBeTruthy();
    expect(menu?.classList.contains('show')).toBe(false);

    toggle?.click();
    fixture.detectChanges();
    expect(menu?.classList.contains('show')).toBe(true);

    toggle?.click();
    fixture.detectChanges();
    expect(menu?.classList.contains('show')).toBe(false);
  });
});
