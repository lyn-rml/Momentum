import { TestBed } from '@angular/core/testing';
import { Preferences } from './preferences';

describe('Preferences', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  it('restores saved category and appearance on startup', () => {
    localStorage.setItem('momentum.category', 'Coding');
    localStorage.setItem('momentum.theme', 'dark');
    const preferences = TestBed.inject(Preferences);
    expect(preferences.categories()).toEqual(['Coding']);
    expect(preferences.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('ignores invalid saved preferences and saves subsequent choices', () => {
    localStorage.setItem('momentum.category', 'Unknown');
    localStorage.setItem('momentum.theme', 'glass');
    const preferences = TestBed.inject(Preferences);
    expect(preferences.categories()).toEqual(['Discipline']);
    expect(preferences.theme()).toBe('light');
    preferences.toggleCategory('Study');
    preferences.selectTheme('dark');
    expect(JSON.parse(localStorage.getItem('momentum.categories')!)).toEqual([
      'Discipline',
      'Study',
    ]);
    expect(localStorage.getItem('momentum.theme')).toBe('dark');
  });
  it('allows multiple categories, deselection, and keeps the last selection', () => {
    const preferences = TestBed.inject(Preferences);
    preferences.toggleCategory('Coding');
    expect(preferences.categories()).toEqual(['Discipline', 'Coding']);
    preferences.toggleCategory('Discipline');
    expect(preferences.categories()).toEqual(['Coding']);
    preferences.toggleCategory('Coding');
    expect(preferences.categories()).toEqual(['Coding']);
  });
  it('restores multiple saved categories', () => {
    localStorage.setItem('momentum.categories', JSON.stringify(['Study', 'Coding']));
    expect(TestBed.inject(Preferences).categories()).toEqual(['Study', 'Coding']);
  });
});
