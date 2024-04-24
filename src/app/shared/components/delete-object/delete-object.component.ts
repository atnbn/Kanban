import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { Board, Task } from '../../models/board-interface';
import { BoardObjectService } from '../../services/add-board/board-object.service';
import { SaveBoardService } from '../../services/save-board/save-board.service';
import { TaskApiService } from '../../services/add-task/add-task-api.service';
import { ReturnMessageService } from '../../services/return-message/return-message.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user/user.service';

@Component({
  selector: 'app-delete-object',
  templateUrl: './delete-object.component.html',
  styleUrls: ['./delete-object.component.scss'],
})
export class DeleteObjectComponent implements OnInit, OnDestroy {
  isTask: boolean = false;
  isDarkMode: boolean = false;
  isLoading: boolean = false;
  allBoards: Board[] = [];
  currentObject?: Task | Board;

  @Input() type?: String;
  @Input() currentBoard?: Board;
  @Input() currentTask?: Task;

  @Output() recivingObject = new EventEmitter<Task | Board>();
  @Output() closePopUp = new EventEmitter<boolean>();
  constructor(
    private themeService: ThemeService,
    private boardService: BoardObjectService,
    private boardApiService: SaveBoardService,
    private taskApiService: TaskApiService,
    private messageService: ReturnMessageService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });

    this.boardService.storage$.subscribe((storage) => {
      this.allBoards = storage;
    });

    this.boardService.getBoard().subscribe((board) => {
      this.currentBoard = board;
    });

    this.boardService.getTask().subscribe((task) => {
      this.currentTask = task;
    });
  }

  ngOnDestroy(): void {
    this.currentTask = {} as Task;
  }

  deleteObject(id: any) {
    if (this.type === 'task') {
      this.onDeleteTask();
    } else if (this.type === 'board') {
      this.onDeleteBoard();
    } else if (this.type === 'user') {
      this.onDeleteUser();
    }

    this.closeDeleteWindow();
    this.recivingObject.emit();
  }

  onDeleteBoard() {
    this.isLoading = true;
    const index = this.allBoards.findIndex(
      (board) => board.id === this.currentBoard?.id
    );
    if (index !== -1) {
      this.boardApiService.deleteBoardObject(this.currentBoard!.id).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.allBoards.splice(index, 1);
          this.messageService.setMessage({
            message: response.message,
            type: 'success',
          });
          if (this.allBoards.length === 0) {
            this.boardService.submitStorage(this.allBoards);
          } else {
            this.boardService.submitBoard(this.allBoards[0]);
          }
          this.router.navigate(['/home']);
          this.boardService.submitStorage(this.allBoards);
          this.closePopUp.emit(false);
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.setMessage({
            message: err.message,
            type: 'error',
          });
          this.closePopUp.emit(false);
        },
      });
    }
  }

  onDeleteTask() {
    const taskId = this.currentTask?.id!;
    const currentColumn = this.currentBoard?.columns.find((column) =>
      column.tasks.some((task) => task.id === taskId)
    );
    this.isLoading = true;

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
              this.isLoading = false;
              this.messageService.setMessage({
                message: response.message,
                type: 'success',
              });
            },
            error: (error) => {
              error.error;
              this.isLoading = false;
              this.messageService.setMessage({
                message: error.error,
                type: 'error',
              });
            },
          });
      }
    }
  }

  onDeleteUser() {
    this.isLoading = true;
    this.userService.deleteUser().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.setMessage({
          message: response.message,
          type: 'success',
        });
        this.router.navigate(['login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.setMessage({
          message: error.error,
          type: 'error',
        });
      },
    });
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
