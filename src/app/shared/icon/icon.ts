import { Component, input } from '@angular/core';

const paths = {
  home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
  bookmark: 'M6 3h12v18l-6-4-6 4Z',
  settings: 'M4 7h16M4 17h16M8 4v6M16 14v6',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  sun: 'M12 3V1m0 22v-2M3 12H1m22 0h-2M5.6 5.6 4.2 4.2m15.6 15.6-1.4-1.4m0-12.8 1.4-1.4M4.2 19.8l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  check: 'm5 12 4 4L19 6',
  book: 'M12 5v16M3 3c4-1 6 0 9 2 3-2 5-3 9-2v16c-4-1-6 0-9 2-3-2-5-3-9-2Z',
  target: 'M21 12a9 9 0 1 1-9-9m9 0-9 9m4-9h5v5M16 12a4 4 0 1 1-4-4',
  briefcase: 'M9 7V3h6v4M3 7h18v14H3ZM3 12c6 3 12 3 18 0M10 13h4',
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',
  activity: 'M2 12h5l3-8 4 16 3-8h5',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16',
} as const;
export type IconName = keyof typeof paths;

@Component({
  selector: 'app-icon',
  template: `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path [attr.d]="paths[name()]" />
  </svg>`,
  styles: `
    :host {
      display: inline-flex;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  protected readonly paths = paths;
}
