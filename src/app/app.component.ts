import { Component } from '@angular/core';
import { OpenPopUpService } from './shared/services/add-board/add-board-up.service';
import { ThemeService } from './shared/services/theme/theme.service';
import { SidebarService } from './shared/services/sidebar/sidebar.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Board } from './shared/services/models/board-interface';
import { BoardObjectService } from './shared/services/add-board/board-object.service';

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
  boards: Board[] = [];
  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private boardService: BoardObjectService
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });

    this.sidebarService.sidebar$.subscribe((status) => {
      this.sidebarState = status;
      console.log(this.sidebarState);
    });

    this.boardService.sidebarData$.subscribe((boards) => {
      if (Object.keys(boards).length !== 0) {
        this.boards.push(boards);
      }
    });
  }

  changeSidebar() {
    this.sidebarService.toggleSidebar();
    this.sidebarState = !this.sidebarState;
    console.log(this.sidebarState);
  }
}
