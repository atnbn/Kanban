import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { Board, Task } from '../../services/models/board-interface';
import { BoardObjectService } from '../../services/add-board/board-object.service';

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
    private boardService: BoardObjectService
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
    // Find and handle board deletion logic here
    const index = this.allBoards.findIndex((board) => board.id === boardId);
    if (index !== -1) {
      this.allBoards.splice(index, 1); // Remove the board from the array
    }
    this.boardService.submitDataToBoard(this.allBoards[0]);
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
