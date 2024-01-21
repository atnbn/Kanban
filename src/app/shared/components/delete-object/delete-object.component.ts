import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { Board, Task } from '../../models/board-interface';
import { BoardObjectService } from '../../services/add-board/board-object.service';
import { SaveBoardService } from '../../services/save-board/save-board.service';
import { TaskApiService } from '../../services/add-task/add-task-api.service';
import { ReturnMessageService } from '../../services/return-message/return-message.service';

@Component({
  selector: 'app-delete-object',
  templateUrl: './delete-object.component.html',
  styleUrls: ['./delete-object.component.scss'],
})
export class DeleteObjectComponent implements OnInit {
  isTask: boolean = false;
  isDarkMode: boolean = false;
  allBoards: Board[] = [];
  currentObject?: Task | Board;

  @Input() edit?: String;
  @Input() currentBoard?: Board;
  @Input() currentTask?: Task;

  @Output() recivingObject = new EventEmitter<Task | Board>();
  @Output() closePopUp = new EventEmitter<boolean>();
  constructor(
    private themeService: ThemeService,
    private boardService: BoardObjectService,
    private boardApiService: SaveBoardService,
    private taskApiService: TaskApiService,
    private messageService: ReturnMessageService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });

    this.boardService.storage$.subscribe((storage) => {
      this.allBoards = storage;
    });

    console.log(this.edit);
  }

  deleteObject(id: any) {
    if (this.edit === 'Task') {
      this.onDeleteTask();
      console.log('delete');
    } else if (this.edit === 'Board') {
      console.log('delete-board');
      this.onDeleteBoard();
    }

    this.closeDeleteWindow();
    this.recivingObject.emit();
  }

  onDeleteBoard() {
    const index = this.allBoards.findIndex(
      (board) => board.id === this.currentBoard?.id
    );
    if (index !== -1) {
      this.boardApiService.deleteBoardObject(this.currentBoard!.id).subscribe({
        next: (response) => {
          this.allBoards.splice(index, 1);
          this.messageService.setMessage({
            message: response.message,
            type: 'success',
          });
          if (this.allBoards.length === 0) {
            this.boardService.submitDataToBoard(this.allBoards);
          } else {
            this.boardService.submitDataToBoard(this.allBoards[0]);
          }
        },
        error: (err) => {
          this.messageService.setMessage({
            message: err.message,
            type: 'error',
          });
        },
      });
    }
  }

  onDeleteTask() {
    console.log(this.currentBoard);
    const taskId = this.currentTask?.id!;
    const currentColumn = this.currentBoard?.columns.find((column) =>
      column.tasks.some((task) => task.id === taskId)
    );
    console.log(currentColumn);

    if (currentColumn) {
      currentColumn.tasks = currentColumn.tasks.filter(
        (task) => task.id !== taskId
      );

      if (this.currentObject?.id === taskId) {
        this.currentObject = null!;
      }

      if (this.currentBoard?.id && currentColumn.id) {
        this.taskApiService
          .deleteTask(this.currentBoard.id, currentColumn.id, taskId)
          .subscribe({
            next: (response) => {
              this.messageService.setMessage({
                message: response.message,
                type: 'success',
              });
            },
            error: (error) => {
              console.log(error.error);
              this.messageService.setMessage({
                message: error.error,
                type: 'error',
              });
            },
          });
      }
    }
  }
  closeDeleteWindow() {
    this.closePopUp.emit(false);
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
