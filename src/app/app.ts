import { afterNextRender, Component, ElementRef, inject, Injector } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './core/layout/sidebar/sidebar';
import { Preferences } from './core/preferences/preferences';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly preferences = inject(Preferences);
  private readonly router = inject(Router);

  protected get minimalLayout(): boolean {
    return this.router.routerState.root.firstChild?.snapshot.data['minimal'] === true;
  }

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private hasActivated = false;

  protected onPageActivated(): void {
    if (this.hasActivated) {
      afterNextRender(
        () => {
          this.element.nativeElement
            .querySelector<HTMLElement>('h1')
            ?.focus({ preventScroll: true });
        },
        { injector: this.injector },
      );
    }
    this.hasActivated = true;
  }
}
