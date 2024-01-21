import { Component, HostListener } from '@angular/core';
import {
  Board,
  Columns,
  Subtask,
  Task,
} from 'src/app/shared/models/board-interface';
import { OpenPopUpService } from 'src/app/shared/services/add-board/add-board-up.service';
import { BoardObjectService } from 'src/app/shared/services/add-board/board-object.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskApiService } from 'src/app/shared/services/add-task/add-task-api.service';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';
import { Message } from 'src/app/shared/models/notification-interface';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  message: string = '';
  isDarkMode: boolean = false;
  addTaskPopUp: boolean = false;
  OpenTaskWindow: boolean = false;
  dropDown: boolean = false;
  sidebarStatus: boolean = false;
  openBoardMenu: boolean = false;
  createBoardMenu: boolean = false;
  deleteWindow: boolean = false;
  task!: Task;

  show: boolean = true;
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
    private popupService: OpenPopUpService,
    private taskService: TaskApiService,
    private messageService: ReturnMessageService
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
      this.board = data;
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
  }

  onDrop(event: any, newStatus: string) {
    const currentColumn = this.findColumnContainingTask(this.currentItem);
    if (currentColumn) {
      const taskIndex = currentColumn?.tasks.findIndex(
        (t) => t.id === this.currentItem.id
      );
      if (taskIndex !== -1) {
        const task = currentColumn.tasks[taskIndex];

        // Remove the task from the current column
        currentColumn.tasks.splice(taskIndex, 1);

        // Find the new column and add the task to it
        const newColumn = this.board.columns.find(
          (col: Columns) => col.id === newStatus
        );
        if (newColumn) {
          task.status[0] = {
            columnName: newColumn.columnName,
            id: newColumn.id,
          };
          console.log(task.status);
          newColumn.tasks.push(task);
          // task.status = newStatus; // Update task status

          // Prepare the updated task data
          const updatedTaskData = { ...task, columnName: newStatus };
          console.log('updatedTaskData', updatedTaskData);
          // Call the API to update the task on the backend
          this.taskService
            .updateTask(
              this.board.id,
              currentColumn.id,
              task.id,
              updatedTaskData
            )
            .subscribe({
              next: (response: any) => {
                this.messageService.setMessage({
                  message: response.message,
                  type: 'success',
                });
              },
              error: (error) => {
                this.messageService.setMessage({
                  message: error.message,
                  type: 'error',
                });
              },
            });

          // Update the rest of your local board state if necessary
          this.boardService.submitBoard(this.board);
        } else {
          console.error(`Column '${newStatus}' not found.`);
        }
      }
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
