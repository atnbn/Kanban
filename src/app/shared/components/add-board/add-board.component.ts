import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BoardObjectService } from '../../services/add-board/board-object.service';
import { Board, Columns, Task } from '../../models/board-interface';
import { OpenPopUpService } from '../../services/add-board/add-board-up.service';
import { SaveBoardService } from '../../services/save-board/save-board.service';
import { ReturnMessageService } from '../../services/return-message/return-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.scss'],
})
export class AddBoardComponent implements OnInit, AfterViewInit {
  boardObject: Board | undefined;
  fields: string[] = [];
  columnObject: any[] = [];
  formGroup!: FormGroup;
  modalOpen: boolean = true;
  message: any;
  edit: boolean = false;
  allBoards!: Board[];
  isDarkMode: boolean = false;
  isLoading: boolean = false;
  deleteForm: boolean = false;
  currentUser: any;
  @ViewChildren('inputElement') inputElement!: QueryList<ElementRef>;
  @Input() type: string = '';
  @Output() closePopUp = new EventEmitter<boolean>();

  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private popupService: OpenPopUpService,
    private boardService: BoardObjectService,
    private saveBoardService: SaveBoardService,
    private messageService: ReturnMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((value) => {
      this.isDarkMode = value;
    });
    this.boardService.getStorage().subscribe((storage) => {
      this.allBoards = storage;
    });

    if (this.type === 'edit') {
      this.edit = true;
      this.boardService.getBoard().subscribe((board) => {
        this.boardObject = board;
      });
      this.initializeEditForm();
    } else {
      this.initializeForm();
    }
  }

  ngAfterViewInit(): void {
    this.inputElement.changes.subscribe((inputs: QueryList<ElementRef>) => {
      const lastInput: ElementRef = inputs.last;
      if (lastInput) {
        lastInput.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  initializeForm() {
    this.formGroup = this.fb.group({
      title: ['', [Validators.minLength(1), Validators.required]],
      inputs: this.fb.array([]),
      columnName: [],
    });
  }

  initializeEditForm() {
    this.formGroup = this.fb.group({
      title: [
        this.boardObject?.title,
        [Validators.minLength(1), Validators.required],
      ],
      inputs: this.fb.array([]),
      columnName: [],
    });

    this.boardObject?.columns.forEach((column) => {
      this.inputs.push(
        this.fb.group({
          columnName: column.columnName,
          id: column.id,
          tasks: this.fb.array(column.tasks),
        })
      );
    });
  }

  get inputs() {
    return this.formGroup.controls['inputs'] as FormArray;
  }

  addInput() {
    const newInputForm = this.fb.group({
      columnName: ['New Column'],
      id: Math.random().toString(16).slice(2, 10),
      tasks: this.fb.array([]),
    });

    this.inputs.push(newInputForm);
  }

  collectInputValues() {
    const values = this.inputs.controls.map((control: any) => control.value);
    return values;
  }

  deleteInput(index: number) {
    this.inputs.removeAt(index);
  }

  changeTaskStatus() {
    this.inputs.value.forEach((column: Columns) => {
      column.tasks.forEach((task: Task) => {
        // task.status = column.columnName;
      });
    });
  }
  checkIfBoardExists() {
    this.allBoards?.find((board) => board.id === this.boardObject?.id);
  }

  createBoardObject() {
    if (this.formGroup.invalid) return;
    this.boardObject = {
      title: this.formGroup.value.title,
      columns: this.inputs.value,
      id: this.boardObject?.id || Math.random().toString(16).slice(2, 10),
    };
  }

  submitForm(event: Event) {
    if (this.type === 'edit') {
      this.updateBoard(event);
    } else if (this.type === 'create') {
      this.createBoard(event);
    }
    this.popupService.closeAddBoard();
  }
  createBoard(event: Event) {
    this.isLoading = true;
    event.preventDefault();
    this.createBoardObject();
    this.saveBoardService.saveBoardObject(this.boardObject).subscribe({
      next: (response: any) => {
        this.messageService.setMessage({
          message: response.message,
          type: 'success',
        });
        this.isLoading = false;
        this.allBoards.push(this.boardObject!);
        this.boardService.submitBoard(this.boardObject!);
        this.boardService.submitStorage(this.allBoards!);
        this.router.navigate([], {
          queryParams: { boardId: this.boardObject?.id },
          queryParamsHandling: 'merge',
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.setMessage({
          message: error.error,
          type: 'error',
        });
      },
    });
    this.closePopUp.emit(false);
  }
  deleteBoard(currBoard: any) {
    this.deleteForm = true;
    const currentBoard = this.allBoards.some(
      (board) => (board.id = currBoard.id)
    );

    if (currentBoard) {
    }
  }
  toggelDeleteWindow() {
    this.deleteForm = false;
  }
  updateBoard(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.createBoardObject();
    const indexToUpdate = this.allBoards.findIndex(
      (board: Board) => board.id === this.boardObject?.id
    );

    if (indexToUpdate !== -1) {
      this.allBoards[indexToUpdate] = {
        title: this.boardObject!.title,
        columns: this.boardObject!.columns,
        id: this.boardObject!.id,
      };
    }
    this.saveBoardService
      .editBoardObject(this.boardObject, this.boardObject?.id!)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.boardService.submitBoard(this.boardObject!);
          if (response.message)
            this.messageService.setMessage({
              message: response.message,
              type: 'success',
            });
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.setMessage({
            message: error.error,
            type: 'error',
          });
        },
      });
    this.boardService.submitBoard(this.boardObject!);
    this.updateExistingBoard(this.boardObject!);
    this.changeTaskStatus();
    this.closePopUp.emit(false);
  }

  updateExistingBoard(currentBoard: Board) {
    // Find the index of the board in the storage array
    const boardIndex = this.allBoards.findIndex(
      (board) => board.id === currentBoard.id
    );
    if (boardIndex !== -1) {
      // Board found, update it
      this.allBoards[boardIndex] = currentBoard;
      this.boardService.submitStorage(this.allBoards);
      return true; // Return true to indicate that the board was successfully updated
    } else {
      // Board not found
      return false; // Return false to indicate that the board was not found
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement.tagName.toLowerCase() === 'section') {
      this.closePopUp.emit(false);
      this.themeService.toggleScroll();
    } else return;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey() {
    this.closePopUp.emit(false);
  }
}
