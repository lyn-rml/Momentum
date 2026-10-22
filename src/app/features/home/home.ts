import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category, Preferences } from '../../core/preferences/preferences';
import { Icon, IconName } from '../../shared/icon/icon';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly preferences = inject(Preferences);
  protected readonly categories: { name: Category; description: string; icon: IconName }[] = [
    { name: 'Discipline', description: 'Show up. Keep going.', icon: 'target' },
    { name: 'Study', description: 'Stay curious. Go deeper.', icon: 'book' },
    { name: 'Career', description: 'Build a path of your own.', icon: 'briefcase' },
    { name: 'Confidence', description: 'Back yourself a little more.', icon: 'spark' },
    { name: 'Fitness', description: 'Progress, one rep at a time.', icon: 'activity' },
    { name: 'Coding', description: 'Think. Build. Begin again.', icon: 'code' },
  ];
}
