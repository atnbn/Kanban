import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
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
import { Board } from '../../models/board-interface';
import { OpenPopUpService } from '../../services/add-board/add-board-up.service';

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.scss'],
})
export class AddBoardComponent implements OnInit {
  boardObject!: Board;
  boardForm!: FormGroup;
  modalOpen: boolean = true;
  isDarkMode: boolean = false;
  @Output() closePopUp = new EventEmitter<boolean>();

  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private popupService: OpenPopUpService,
    private boardService: BoardObjectService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
    this.boardForm = this.fb.group({
      title: new FormControl('', [
        Validators.minLength(1),
        Validators.required,
      ]),
      columns: this.fb.array([
        this.fb.control('Todo'),
        this.fb.control('Doing'),
      ]),
    });
  }

  changeMode() {
    this.themeService.toggleTheme();
  }
  get columns() {
    return this.boardForm?.get('columns') as FormArray;
  }

  removeInput(index: number) {
    this.columns.removeAt(index);
  }
  createNewColumn() {
    const newField = this.fb.control('');

    this.columns.push(newField);
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

  submitForm() {
    const boardValues = this.boardForm.value;

    if (this.boardForm.valid) {
      this.boardObject = {
        title: boardValues.title,
        columns: boardValues.columns,
        id: Math.random().toString(16).slice(2, 10),
      };

      this.boardService.addBoardObject(this.boardObject);

      this.popupService.closeAddBoard();
    }

    // Handle form submission logic here
  }
}
