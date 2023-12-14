import { Component } from '@angular/core';
import {
  Board,
  Columns,
  Task,
} from 'src/app/shared/services/models/board-interface';
import { OpenPopUpService } from 'src/app/shared/services/add-board/add-board-up.service';
import { BoardObjectService } from 'src/app/shared/services/add-board/board-object.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  isDarkMode: boolean = false;
  addTaskPopUp: boolean = false;
  OpenTaskWindow: boolean = false;
  dropDown: boolean = false;
  sidebarStatus: boolean = false;
  openBoardMenu: boolean = false;

  task!: Task;
  colors: string[] = [
    '#3498db',
    '#2ecc71',
    '#e74c3c',
    '#f39c12',
    '#9b59b6',
    '#1abc9c ',
    '#e67e22',
    '#34495e',
  ];
  board: any = {};
  constructor(
    private themeService: ThemeService,
    private boardService: BoardObjectService,
    private sidebarService: SidebarService,
    private popupService: OpenPopUpService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });

    this.sidebarService.sidebar$.subscribe((status) => {
      this.sidebarStatus = status;
    });

    this.popupService.addTask$.subscribe((value) => {
      this.addTaskPopUp = value;
    });

    this.boardService.sidebarData$.subscribe((data) => {
      if (Object.keys(data).length > 0) {
        this.board = data;
        // console.log(data);
      } else {
        this.board = data;
      }
    });
  }

  openAddTask(): void {
    this.addTaskPopUp = true;
  }

  openTask(task: Task) {
    this.OpenTaskWindow = true;
    this.boardService.submitTask(task);
    this.boardService.submitDataToBoard(this.board);
    this.task = task;
  }

  closeTask() {
    this.OpenTaskWindow = false;
  }

  closeAddTask(): void {
    this.addTaskPopUp = false;
  }

  editBoard(): void {
    this.openBoardMenu = true;
    this.boardService.submitBoard(this.board);
  }

  openSettings(): void {
    this.dropDown = true;
  }

  closePopUp(): void {
    this.addTaskPopUp = false;
  }
}
