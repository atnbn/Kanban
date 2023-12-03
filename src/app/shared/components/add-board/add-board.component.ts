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
import { Board, Columns } from '../../models/board-interface';
import { OpenPopUpService } from '../../services/add-board/add-board-up.service';

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.scss'],
})
export class AddBoardComponent implements OnInit {
  boardObject!: Board[];
  fields: string[] = [];
  columnObject: any[] = [];

  formGroup!: FormGroup;
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
    this.initializeForm();
  }

  initializeForm() {
    this.formGroup = this.fb.group({
      title: ['', [Validators.minLength(1), Validators.required]],
      inputs: this.fb.array([]),
    });
  }

  get inputs() {
    return this.formGroup.controls['inputs'] as FormArray;
  }

  addInput() {
    const inputForm = this.fb.control('New Column');
    this.inputs.push(inputForm);
    console.log(this.inputs);
  }

  collectInputValues() {
    const values = this.inputs.controls.map((control: any) => control.value);
    return values;
  }

  createColumnObject(arr: any[]) {
    arr.forEach((value) => {
      let column = {
        boardName: value,
        tasks: [],
      };
      this.columnObject.push(column);
    });
  }

  deleteInput(index: number) {
    this.inputs.removeAt(index);
  }
  submitForm() {
    const values = this.collectInputValues();

    this.createColumnObject(values);
    const formArrayValue = this.formGroup.get('inputFields')?.value;
    console.log(formArrayValue);
    const boardValues = this.formGroup.value;
    if (this.formGroup.valid) {
      this.boardObject = [
        {
          title: boardValues.title,
          columns: this.columnObject,
          id: Math.random().toString(16).slice(2, 10),
        },
      ];
      this.boardService.addBoardObject(this.boardObject);

      this.popupService.closeAddBoard();
    }
    console.log(boardValues);
    // Handle form submission logic here
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
