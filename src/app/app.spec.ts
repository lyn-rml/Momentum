import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('Application navigation', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it.each([
    ['/', '/home', 'Home'],
    ['/home', '/home', 'Home'],
    ['/quote', '/quote', 'Quotes'],
    ['/missing-page', '/missing-page', 'Page not found'],
  ])('renders %s with the correct active navigation', async (url, expectedUrl, heading) => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    fixture.detectChanges();
    await router.navigateByUrl(url);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe(expectedUrl);
    expect(element.querySelector('h1')?.textContent).toBe(heading);
    const activeLinks = element.querySelectorAll('nav a[aria-current="page"]');
    expect(activeLinks.length).toBe(heading === 'Page not found' ? 0 : 1);
    if (heading !== 'Page not found') expect(activeLinks[0]?.textContent).toContain(heading);
  });

  it('keeps the shared navigation mounted when switching pages', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    fixture.detectChanges();
    await router.navigateByUrl('/home');
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const navigation = element.querySelector('nav');
    await router.navigateByUrl('/quote');
    await fixture.whenStable();
    expect(element.querySelector('nav')).toBe(navigation);
    expect(element.querySelector('h1')?.textContent).toBe('Quotes');
  });
  it('uses the selected category on the quote page and removes extra page decoration', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    fixture.detectChanges();
    await router.navigateByUrl('/home');
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const coding = Array.from(element.querySelectorAll<HTMLButtonElement>('.category-tile')).find(
      (button) => button.textContent?.includes('Coding'),
    )!;
    coding.click();
    fixture.detectChanges();
    expect(coding.getAttribute('aria-pressed')).toBe('true');
    expect(element.querySelectorAll('.category-tile[aria-pressed="true"]').length).toBe(2);
    await router.navigateByUrl('/quote');
    await fixture.whenStable();
    expect(element.querySelector('.quote-meta')?.textContent).toMatch(/Coding|Discipline/);
    expect(element.querySelector('blockquote')?.textContent?.trim().length).toBeGreaterThan(0);
    expect(element.querySelector('.workspace-header')).toBeNull();
    expect(element.querySelector('.workspace-footer')).toBeNull();
    expect(element.querySelector('app-sidebar')).not.toBeNull();
    await router.navigateByUrl('/home');
    await fixture.whenStable();
    expect(element.querySelector('.workspace-header')).not.toBeNull();
    localStorage.clear();
  });
  it('advances through quotes without changing the displayed date', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/quote');
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const initial = element.querySelector('blockquote')?.textContent;
    const date = element.querySelector('time')?.textContent;
    const next = element.querySelector<HTMLButtonElement>('button[aria-label="Next quote"]')!;
    next.click();
    fixture.detectChanges();
    expect(element.querySelector('blockquote')?.textContent).not.toBe(initial);
    expect(element.querySelector('time')?.textContent).toBe(date);
    expect(element.querySelector('.quote-meta')?.textContent).toContain('Discipline');
    next.click();
    next.click();
    fixture.detectChanges();
    expect(element.querySelector('blockquote')?.textContent).toBe(initial);
  });
});
