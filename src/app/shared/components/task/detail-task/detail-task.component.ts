import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { BoardObjectService } from 'src/app/shared/services/add-board/board-object.service';
import {
  Board,
  Columns,
  Subtask,
  Task,
} from 'src/app/shared/models/board-interface';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { TaskApiService } from 'src/app/shared/services/add-task/add-task-api.service';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';
import { FormControl, FormGroup } from '@angular/forms';
import { OpenPopUpService } from 'src/app/shared/services/add-board/add-board-up.service';
@Component({
  selector: 'app-detail-task',
  templateUrl: './detail-task.component.html',
  styleUrls: ['./detail-task.component.scss'],
})
export class DetailTaskComponent implements OnInit {
  isDarkMode: boolean = false;
  formGroup!: FormGroup;
  dropDown: boolean = false;
  currentBoard!: Board;
  edit: boolean = false;
  deleteForm: boolean = false;
  currentTask!: Task;
  checkedCount: number = 0;
  @Output() closePopUp = new EventEmitter<boolean>(false);
  @Output() closeDeletePopUp = new EventEmitter<boolean>(false);
  constructor(
    private themeService: ThemeService,
    private boardService: BoardObjectService,
    private taskApiService: TaskApiService,
    private messageService: ReturnMessageService,
    private popupService: OpenPopUpService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });

    this.boardService.getTask().subscribe((object: Task) => {
      this.currentTask = object;
    });

    this.boardService.getBoard().subscribe((board: Board) => {
      this.currentBoard = board;
    });
    this.calculateDoneSubtasks();
  }

  public openDropDown() {
    this.dropDown = true;
  }
  public onCloseEdit(isClose: boolean) {
    this.edit = isClose;
  }
  public changeValue(subtask: Subtask) {
    subtask.done = !subtask.done;
    this.calculateDoneSubtasks();
    this.saveTask(this.currentTask);
  }

  onColumnSelect(event: Event) {
    // Assert the event target as HTMLSelectElement
    const selectElement = event.target as HTMLSelectElement | null;

    if (selectElement && selectElement.value) {
      const selectedColumnId = selectElement.value;
      const column = this.currentBoard.columns.find(
        (c) => c.id === selectedColumnId
      );
      if (column) {
        this.currentTask.status[0] = {
          id: column.id,
          columnName: column.columnName,
        };
      }
      // this.moveTask(this.currentTask, this.currentTask.status[0].id);
      this.moveTask(this.currentTask.status[0].id);
    }
  }

  public toggelDeleteTaskWindow() {
    this.deleteForm = !this.deleteForm;
  }

  editTask() {
    this.popupService.openEditTask();
    this.themeService.toggleScroll();
    this.boardService.submitTask(this.currentTask);
  }

  closeWindow(boolean: boolean) {
    this.edit = boolean;
  }

  closeDeleteWindow(boolean: boolean) {
    this.deleteForm = boolean;
  }

  calculateDoneSubtasks() {
    this.checkedCount = 0;
    this.currentTask.subtasks?.forEach((subtask) => {
      if (subtask.done) {
        this.checkedCount++;
      }
      if (subtask.done === false) {
      }
    });
  }

  saveTask(task: Task) {
    const currentColumn = this.findColumnContainingTask(task);

    if (currentColumn) {
      const existingTask = currentColumn.tasks.find((t) => t.id === task.id);

      if (existingTask) {
        // Check if any property is different before updating
        if (!this.checkIfTasksEqual(existingTask, task)) {
          // Remove the existing task
          currentColumn.tasks = currentColumn.tasks.filter(
            (t) => t.id !== task.id
          );

          // Add the updated task

          currentColumn.tasks.push(task);
        }
        this.taskApiService
          .updateTask(this.currentBoard.id, currentColumn.id, task.id, task)
          .subscribe({
            next: (result: any) => {
              this.messageService.setMessage({
                message: result.message,
                type: 'success',
              });
            },
            error: (error) =>
              this.messageService.setMessage({
                message: error.error,
                type: 'success',
              }),
          });
      }
    }
  }

  checkIfTasksEqual(task1: Task, task2: Task): boolean {
    return (
      task1.id === task2.id &&
      task1.title === task2.title &&
      task1.description === task2.description &&
      task1.status === task2.status &&
      JSON.stringify(task1.subtasks) === JSON.stringify(task2.subtasks)
    );
  }

  deleteTask(taskId: string) {
    const currentColumn = this.currentBoard.columns.find((column) =>
      column.tasks.some((task) => task.id === taskId)
    );

    if (currentColumn) {
      currentColumn.tasks = currentColumn.tasks.filter(
        (task) => task.id !== taskId
      );

      if (this.currentTask.id === taskId) {
        this.currentTask = null!;
      }
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement.tagName.toLowerCase() === 'section') {
      this.closePopUp.emit(false);
      this.dropDown = false;
    }
    if (clickedElement.tagName.toLowerCase() === 'div') {
      this.dropDown = false;
    } else return;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey() {
    this.closePopUp.emit(false);
  }

  moveTask(newStatus: string) {
    const currentColumn = this.findColumnContainingTask(this.currentTask);
    if (currentColumn) {
      const taskIndex = currentColumn?.tasks.findIndex(
        (t) => t.id === this.currentTask.id
      );
      if (taskIndex !== -1) {
        const task = currentColumn.tasks[taskIndex];

        // Remove the task from the current column
        currentColumn.tasks.splice(taskIndex, 1);

        // Find the new column and add the task to it
        const newColumn = this.currentBoard.columns.find(
          (col: Columns) => col.id === newStatus
        );
        if (newColumn) {
          newColumn.tasks.push(task);
          // task.status = newStatus; // Update task status

          // Prepare the updated task data
          const updatedTaskData = { ...task };
          // Call the API to update the task on the backend
          this.taskApiService
            .updateTask(
              this.currentBoard.id,
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
                  message: error.error,
                  type: 'error',
                });
              },
            });

          // Update the rest of your local board state if necessary
          this.boardService.submitBoard(this.currentBoard);
        } else {
          console.error(`Column '${newStatus}' not found.`);
        }
      }
    }
  }

  // private moveTask(task: Task, newStatus: string) {
  //   const currentColumn = this.findColumnContainingTask(task);

  //   if (currentColumn && currentColumn.columnName !== newStatus) {
  //     // Remove task from current column
  //     currentColumn.tasks = currentColumn.tasks.filter((t) => t.id !== task.id);

  //     // Find the new column
  //     const newColumn = this.currentBoard.columns.find(
  //       (column) => column.id === newStatus
  //     );

  //     if (newColumn) {
  //       // Add task to the new column
  //       newColumn.tasks.push(task);

  //       // Update the task status
  //       // task.status = newStatus;
  //     } else {
  //       console.error(`Column '${newStatus}' not found.`);
  //     }
  //   }
  // }

  private findColumnContainingTask(task: Task): Columns | undefined {
    return this.currentBoard.columns.find((column: Columns) =>
      column.tasks.some((t: any) => t.id === task.id)
    );
  }
}
