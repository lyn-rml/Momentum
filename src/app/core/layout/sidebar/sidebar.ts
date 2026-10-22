import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navigation } from '../navigation';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, Navigation],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {}
