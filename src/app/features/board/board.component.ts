import { Component, HostListener, Renderer2 } from '@angular/core';
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
import { MediaQueryService } from 'src/app/shared/services/media-query/media-query.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  message: string = '';
  isDarkMode: boolean = false;
  storage: Board[] = [];
  addTaskPopUp: boolean = false;
  OpenTaskWindow: boolean = false;
  dropDown: boolean = false;
  sidebarStatus: boolean = false;
  openBoardMenu: boolean = false;
  createBoardMenu: boolean = false;
  deleteWindow: boolean = false;
  task!: Task;
  routeSub!: Subscription;
  private mediaQuerySubscription: Subscription | undefined;
  isMobile: boolean = false;

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
    private messageService: ReturnMessageService,
    private mediaQueryService: MediaQueryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
    this.boardService.getBoard().subscribe((data) => {
      this.board = data;
    });
    this.sidebarService.sidebar$.subscribe((status) => {
      this.sidebarStatus = status;
    });

    this.popupService.addTask$.subscribe((value) => {
      this.addTaskPopUp = value;
    });

    this.boardService.storage$.subscribe((data) => {
      this.storage = data;
    });

    this.mediaQuerySubscription = this.mediaQueryService.isMobile$.subscribe(
      (isMobile) => {
        this.isMobile = isMobile;
        // Your logic for mobile screen size
      }
    );
    this.routeSub = this.route.queryParams.subscribe((params) => {
      const boardId = params['boardId'];
      if (boardId) {
        const foundObject = this.storage.find((obj) => obj.id === boardId);
        if (foundObject) {
          this.board = foundObject;
        }
      } else {
        this.board = this.storage[0];
      }
    });
  }

  ngOnDestroy() {
    if (this.mediaQuerySubscription) {
      this.mediaQuerySubscription.unsubscribe();
    }
  }

  openAddTask(): void {
    // this.addTaskPopUp = true;
    this.popupService.openAddTask();
    this.boardService.submitBoard(this.board);
    this.themeService.toggleScroll();
  }

  openTask(task: Task) {
    this.popupService.openDetailTask();
    this.boardService.submitTask(task);
    this.themeService.toggleScroll();
    this.boardService.submitBoard(this.board);
  }
  currentItem: any = {};

  closeTask() {
    this.OpenTaskWindow = false;
    this.themeService.toggleScroll();
  }

  closeAddTask(): void {
    this.addTaskPopUp = false;
    this.themeService.toggleScroll();
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
          newColumn.tasks.push(task);
          // task.status = newStatus; // Update task status

          // Prepare the updated task data
          const updatedTaskData = { ...task, columnName: newStatus };
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
    console.log();
    this.boardService.submitBoard(this.board);
    this.popupService.openEditBoard();
    this.themeService.toggleScroll();
  }

  closeBoardMenu(): void {
    this.openBoardMenu = false;
    this.createBoardMenu = false;
  }

  toggleDeleteWindow(): void {
    this.deleteWindow = !this.deleteWindow;
    this.dropDown = false;
  }

  toggleSettings(): void {
    this.dropDown = !this.dropDown;
  }

  closePopUp(): void {
    this.addTaskPopUp = false;
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const dropDown = clickedElement.tagName.toLowerCase();
    const backdrop = clickedElement.className.toLowerCase().split(' ')[0];
    if (backdrop === 'backdrop') {
      this.sidebarService.toggleSidebar();
      this.sidebarStatus = false;
    } else if (dropDown === 'section') {
      this.dropDown = false;
    } else return;
  }
}
