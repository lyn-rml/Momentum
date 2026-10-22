import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule, Icon],
  template: `
    <header class="page-heading">
      <div>
        <p class="eyebrow">A SMALL DETOUR</p>
        <h1 tabindex="-1">Page not found</h1>
        <p class="page-description">Let’s find your way back.</p>
      </div>
    </header>
    <section class="empty-panel" aria-labelledby="missing-heading">
      <span class="error-number" aria-hidden="true">404</span>
      <h2 id="missing-heading">A different path awaits.</h2>
      <p>This page doesn’t exist. Your daily pause is still right here.</p>
      <a matButton="filled" routerLink="/home">Back to Home <app-icon name="arrow" /></a>
    </section>
  `,
  styles: `
    .error-number {
      font-size: clamp(4rem, 12vw, 7rem);
      color: var(--text-secondary);
      font-weight: 300;
      letter-spacing: -0.08em;
      margin-bottom: 12px;
    }
  `,
})
export class NotFound {}
