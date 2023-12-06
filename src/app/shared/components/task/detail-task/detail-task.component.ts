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
} from 'src/app/shared/services/models/board-interface';
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
  deleteForm: boolean = true;
  currentTask!: Task;
  constructor(
    private themeService: ThemeService,
    private boardService: BoardObjectService
  ) {}
  @Output() closePopUp = new EventEmitter<boolean>();
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
  }

  public openDropDown() {
    this.dropDown = true;
  }
  public changeValue(subtask: Subtask) {
    subtask.done = !subtask.done;
  }

  public onSelectChange(event: any) {
    const newStatus = (this.currentTask.status = event.target.value);
    this.moveTask(this.currentTask, newStatus);
  }

  public toggelDeleteTaskWindow() {
    this.deleteForm = !this.deleteForm;
    console.log('test');
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
        this.closePopUp.emit(false);
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
    } else return;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey() {
    this.closePopUp.emit(false);
  }
}
