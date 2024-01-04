import { Component, HostListener } from '@angular/core';
import {
  Board,
  Columns,
  Subtask,
  Task,
} from 'src/app/shared/services/models/board-interface';
import { OpenPopUpService } from 'src/app/shared/services/add-board/add-board-up.service';
import { BoardObjectService } from 'src/app/shared/services/add-board/board-object.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  createBoardMenu: boolean = false;
  deleteWindow: boolean = false;
  task!: Task;
  emptyBoard: boolean = false;
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
  board: any = {
    columns: [],
  };
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
      if (data.id === '0' && !null) {
        console.log('test');
        this.createBoardMenu = true;
        this.emptyBoard = true;
      } else {
        this.emptyBoard = false;
      }
      if (Object.keys(data).length > 0) {
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
  currentItem: any = {};

  closeTask() {
    this.OpenTaskWindow = false;
  }

  closeAddTask(): void {
    this.addTaskPopUp = false;
  }
  onDragStart(task: any) {
    this.currentItem = task;

    console.log(this.currentItem);
  }

  onDrop(event: any, status: string) {
    const column = this.findColumnContainingTask(this.currentItem);
    if (column) {
      const currentColumn = this.findColumnContainingTask(this.currentItem);
      const task = currentColumn?.tasks.find(
        (t: any) => t.id === this.currentItem.id
      );
      currentColumn?.tasks.splice(currentColumn?.tasks.indexOf(task!), 1);
      this.board.columns
        .find((column: any) => column.columnName === status)
        ?.tasks.push(task);
      this.boardService.submitBoard(this.board);
    }
  }
  returnSomething(subtask: any) {
    let checkedCount = 0;
    subtask.forEach((subtask: any) => {
      if (subtask.done) {
        checkedCount++;
      }
    });
    return checkedCount;
  }
  onDropColumn(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.board.columns,
      event.previousIndex,
      event.currentIndex
    );
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  private findColumnContainingTask(task: Task): Columns | undefined {
    return this.board.columns.find((column: any) =>
      column.tasks.some((t: any) => t.id === task.id)
    );
  }

  editBoard(): void {
    this.openBoardMenu = true;
    this.boardService.submitBoard(this.board);
    this.dropDown = false;
  }

  closeBoardMenu(): void {
    this.openBoardMenu = false;
    this.createBoardMenu = false;
  }

  toggleDeleteWindow(): void {
    this.deleteWindow = !this.deleteWindow;
    this.dropDown = false;
  }

  openSettings(): void {
    this.dropDown = true;
  }

  closePopUp(): void {
    this.addTaskPopUp = false;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement.tagName.toLowerCase() === 'div') {
      this.dropDown = false;
    } else return;
  }
}
