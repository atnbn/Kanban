import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { BoardObjectService } from '../../services/add-board/board-object.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isDarkMode: boolean = false;
  addTaskPopUp: boolean = false;
  sidebarStatus: boolean = false;
  board: any = {
    title: 'Todo',
    columns: [],
    id: '123123',
  };
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
      this.sidebarStatus = status;
    });

    this.boardService.getBoardObjects().subscribe((board) => {
      if (Object.keys(board).length > 1) {
        this.board = Object.values(board);
      }
    });
  }

  openAddTask() {
    this.addTaskPopUp = true;
  }

  closeAddTask() {
    this.addTaskPopUp = false;
    console.log('Modal closed:', this.addTaskPopUp);
  }
}
