import { Component } from '@angular/core';
import { BoardObjectService } from 'src/app/shared/services/add-board/board-object.service';
import { Board } from 'src/app/shared/models/board-interface';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isDarkMode: boolean = false;
  sidebarState: boolean = false;
  boards: Board[] = [];
  emptyBoard: boolean = false;
  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private boardService: BoardObjectService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
    this;
    this.sidebarService.sidebar$.subscribe((status) => {
      this.sidebarState = status;
    });
    this.boardService.sidebarData$.subscribe((boards) => {
      if (Object.keys(boards).length !== 0) {
        this.boards.push(boards);
        this.emptyBoard = false;
      } else {
        this.emptyBoard = true;
      }
    });
  }

  changeSidebar() {
    this.sidebarService.toggleSidebar();
    this.sidebarState = !this.sidebarState;
  }
}
