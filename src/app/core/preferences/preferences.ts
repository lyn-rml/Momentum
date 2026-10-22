import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export const categoryNames = [
  'Discipline',
  'Study',
  'Career',
  'Confidence',
  'Fitness',
  'Coding',
] as const;
export type Category = (typeof categoryNames)[number];
export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class Preferences {
  private readonly document = inject(DOCUMENT);
  private readonly categoryState = signal<readonly Category[]>(['Discipline']);
  private readonly themeState = signal<Theme>('light');
  readonly categories = this.categoryState.asReadonly();
  readonly theme = this.themeState.asReadonly();

  constructor() {
    try {
      const storage = this.document.defaultView?.localStorage;
      const saved = storage?.getItem('momentum.categories');
      const legacy = storage?.getItem('momentum.category');
      let categories: unknown;
      try {
        categories = saved ? JSON.parse(saved) : [legacy];
      } catch {
        categories = [];
      }
      const theme = storage?.getItem('momentum.theme');
      if (Array.isArray(categories)) {
        const valid = categoryNames.filter((name) => categories.includes(name));
        if (valid.length) this.categoryState.set(valid);
      }
      if (theme === 'light' || theme === 'dark') this.themeState.set(theme);
    } catch {}
    this.applyTheme();
  }

  toggleCategory(category: Category): void {
    const current = this.categories();
    if (current.length === 1 && current.includes(category)) return;
    const next = current.includes(category)
      ? current.filter((name) => name !== category)
      : categoryNames.filter((name) => current.includes(name) || name === category);
    this.categoryState.set(next);
    this.save('momentum.categories', JSON.stringify(next));
  }

  selectTheme(theme: Theme): void {
    this.themeState.set(theme);
    this.applyTheme();
    this.save('momentum.theme', theme);
  }

  private applyTheme(): void {
    this.document.documentElement.dataset['theme'] = this.theme();
  }

  private save(key: string, value: string): void {
    try {
      this.document.defaultView?.localStorage.setItem(key, value);
    } catch {}
  }
}
