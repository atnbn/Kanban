import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
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
import { Board, Columns, Task } from '../../services/models/board-interface';
import { OpenPopUpService } from '../../services/add-board/add-board-up.service';

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.scss'],
})
export class AddBoardComponent implements OnInit {
  boardObject: Board | undefined;
  fields: string[] = [];
  columnObject: any[] = [];
  edit: boolean = false;
  formGroup!: FormGroup;
  modalOpen: boolean = true;
  allBoards!: Board[];
  isDarkMode: boolean = false;
  deleteForm: boolean = false;
  @Input() currentBoard: Board | null = null;

  @Output() closePopUp = new EventEmitter<boolean>();

  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private popupService: OpenPopUpService,
    private boardService: BoardObjectService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((value) => {
      this.isDarkMode = value;
    });
    if (this.currentBoard !== null) {
      this.boardService.getStorage().subscribe((storage) => {
        this.allBoards = storage;
      });
      this.edit = true;
      this.boardObject = this.currentBoard;
      this.initializeEditForm();
    } else {
      this.initializeForm();
    }
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
      tasks: this.fb.array([]), // You might need to adjust this depending on your requirements
    });

    this.inputs.push(newInputForm);
    console.log(this.inputs);
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
        console.log('task', task);
        task.status = column.columnName;
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

  submitForm() {
    if (this.edit) {
      this.updateBoard();
    } else {
      this.createBoard();
    }
    this.popupService.closeAddBoard();
  }
  createBoard() {
    this.createBoardObject();
    this.boardService.addBoardObject(this.boardObject!);
    this.boardService.submitDataToBoard(this.boardObject!);
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
  updateBoard() {
    this.createBoardObject();

    const indexToUpdate = this.allBoards.findIndex(
      (board: Board) => board.id === this.boardObject?.id
    );

    if (indexToUpdate !== -1) {
      // If the board with the specified id is found, update it
      this.allBoards[indexToUpdate] = {
        title: this.boardObject!.title,
        columns: this.boardObject!.columns,
        id: this.boardObject!.id,
      };
    }
    this.boardService.submitDataToBoard(this.boardObject);

    this.changeTaskStatus();
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
