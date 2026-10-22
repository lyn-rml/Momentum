import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Preferences } from '../../core/preferences/preferences';
import { Icon } from '../../shared/icon/icon';
import { dailyQuote } from './quotes';

@Component({
  selector: 'app-quote',
  imports: [DatePipe, Icon],
  templateUrl: './quote.html',
  styleUrl: './quote.scss',
})
export class Quote implements OnDestroy {
  protected readonly preferences = inject(Preferences);
  protected readonly today = signal(new Date());
  private readonly offset = signal(0);
  protected readonly quote = computed(() =>
    dailyQuote(this.preferences.categories(), this.today(), this.offset()),
  );
  private readonly clock = setInterval(() => this.today.set(new Date()), 30_000);

  protected nextQuote(): void {
    this.offset.update((offset) => offset + 1);
  }

  ngOnDestroy(): void {
    clearInterval(this.clock);
  }
}
