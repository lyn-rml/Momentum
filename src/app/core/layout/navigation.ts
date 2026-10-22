import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon, IconName } from '../../shared/icon/icon';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, Icon],
  template: `
    <nav aria-label="Main navigation">
      @for (item of items; track item.path) {
        <a [routerLink]="item.path" routerLinkActive="active" ariaCurrentWhenActive="page">
          <app-icon [name]="item.icon" />
          <span>{{ item.label }}</span>
          <span class="active-dot" aria-hidden="true"></span>
        </a>
      }
    </nav>
  `,
  styleUrl: './navigation.scss',
})
export class Navigation {
  protected readonly items: { path: string; label: string; icon: IconName }[] = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/quote', label: 'Quotes', icon: 'book' },
  ];
}
