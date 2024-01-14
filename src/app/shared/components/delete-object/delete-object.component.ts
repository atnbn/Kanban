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
  @Input() board?: Board;
  @Input() task?: Task;

  @Output() recivingObject = new EventEmitter<Task | Board>();
  @Output() closePopUp = new EventEmitter<boolean>();
  constructor(
    private themeService: ThemeService,
    private boardService: BoardObjectService,
    private boardApiService: SaveBoardService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });

    if (this.board !== undefined) {
      this.isTask = false;
      this.boardService.storage$.subscribe((storage) => {
        this.allBoards = storage;
      });
      this.currentObject = this.board;
    }
    if (this.task !== undefined) {
      this.isTask = true;
      this.currentObject = this.task;
    }
  }
  deleteObject(id: any) {
    if (this.isTask) {
      // this.onDeleteTask(id);
    } else {
      this.onDeleteBoard(id);
    }
    this.closeDeleteWindow();
    this.recivingObject.emit();
  }
  onDeleteBoard(boardId: string) {
    const index = this.allBoards.findIndex((board) => board.id === boardId);
    if (index !== -1) {
      this.boardApiService.deleteBoardObject(boardId).subscribe({
        next: (response) => {
          this.allBoards.splice(index, 1);

          if (this.allBoards.length === 0) {
            this.boardService.submitDataToBoard(this.allBoards);
          } else {
            this.boardService.submitDataToBoard(this.allBoards[0]);
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
  onDeleteTask(taskId: string) {
    // Find and handle task deletion logic here
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
