import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { OpenPopUpService } from 'src/app/shared/services/add-board/add-board-up.service';
import { BoardObjectService } from 'src/app/shared/services/add-board/board-object.service';
import {
  Board,
  Columns,
  Subtask,
  Task,
} from 'src/app/shared/models/board-interface';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
@Component({
  selector: 'app-detail-task',
  templateUrl: './detail-task.component.html',
  styleUrls: ['./detail-task.component.scss'],
})
export class DetailTaskComponent implements OnInit {
  isDarkMode: boolean = false;
  dropDown: boolean = false;
  currentBoard!: Board;
  edit: boolean = false;
  deleteForm: boolean = false;
  currentTask!: Task;
  checkedCount: number = 0;
  @Output() closePopUp = new EventEmitter<boolean>(false);
  constructor(
    private themeService: ThemeService,
    private boardService: BoardObjectService
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });

    this.boardService.getTask().subscribe((object: Task) => {
      this.currentTask = object;
    });

    this.boardService.sidebarData$.subscribe((board: Board) => {
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
  }

  public onSelectChange(event: any) {
    const newStatus = (this.currentTask.status = event.target.value);
    this.moveTask(this.currentTask, newStatus);
  }

  public toggelDeleteTaskWindow() {
    this.deleteForm = !this.deleteForm;
    console.log('test');
  }

  editTask() {
    this.edit = true;
  }

  closeWindow(boolean: boolean) {
    this.edit = boolean;
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

  // saveTask(task: Task) {
  //   const currentColumn = this.findColumnContainingTask(task);
  //   if (currentColumn ) {
  //     currentColumn.tasks = currentColumn.tasks.filter((t) => t.id !== task.id);

  //     currentColumn.tasks.push(task);
  //   }
  // }
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
          console.log('task is safed');
        }
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

  private moveTask(task: Task, newStatus: string) {
    const currentColumn = this.findColumnContainingTask(task);

    if (currentColumn && currentColumn.columnName !== newStatus) {
      // Remove task from current column
      currentColumn.tasks = currentColumn.tasks.filter((t) => t.id !== task.id);

      // Find the new column
      const newColumn = this.currentBoard.columns.find(
        (column) => column.columnName === newStatus
      );

      if (newColumn) {
        // Add task to the new column
        newColumn.tasks.push(task);

        // Update the task status
        task.status = newStatus;
      } else {
        console.error(`Column '${newStatus}' not found.`);
      }
    }
  }

  private findColumnContainingTask(task: Task): Columns | undefined {
    return this.currentBoard.columns.find((column) =>
      column.tasks.some((t) => t.id === task.id)
    );
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement.tagName.toLowerCase() === 'section') {
      this.closePopUp.emit(false);
      this.saveTask(this.currentTask);
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
}
