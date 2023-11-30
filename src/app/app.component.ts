import { Component } from '@angular/core';
import { OpenPopUpService } from './shared/services/add-board/add-board-up.service';
import { ThemeService } from './shared/services/theme/theme.service';
import { SidebarService } from './shared/services/sidebar/sidebar.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeInOutHeader', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0%)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(-100%)' })
        ),
      ]),
    ]),
  ],
})
export class AppComponent {
  title = 'Project';
  isDarkMode: boolean = false;
  sidebarState: boolean = false;
  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });

    this.sidebarService.sidebar$.subscribe((status) => {
      this.sidebarState = status;
      console.log(this.sidebarState);
    });
  }

  changeSidebar() {
    this.sidebarService.toggleSidebar();
    this.sidebarState = !this.sidebarState;
    console.log(this.sidebarState);
  }
}
