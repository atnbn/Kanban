import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ThemeService } from '../../../services/theme/theme.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Board, Subtask, Task } from '../../../services/models/board-interface';
import { BoardObjectService } from '../../../services/add-board/board-object.service';
import { OpenPopUpService } from '../../../services/add-board/add-board-up.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export default class AddTaskComponent implements OnInit {
  taskObject!: Task;
  edit: boolean = false;
  modalOpen: boolean = true;
  formGroup!: FormGroup;
  isDarkMode: boolean = false;
  currentBoard!: Board;
  subTaskObject: any[] = [];
  @Input() currentTask: Task | null = null;
  @Output() closePopUp = new EventEmitter<boolean>();
  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private boardService: BoardObjectService,
    private popupService: OpenPopUpService
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });

    this.boardService.sidebarData$.subscribe((data) => {
      if (Object.keys(data).length > 0) {
        this.currentBoard = data;
        console.log('addtask object', data);
      }
    });

    if (this.currentTask !== null) {
      this.taskObject = this.currentTask;
      console.log(this.taskObject);
      this.fillForm();
      this.edit = true;
    } else {
      this.initializeForm();
    }
  }

  initializeForm() {
    this.formGroup = this.fb.group({
      title: ['', [Validators.minLength(1), Validators.required]],
      description: ['', [Validators.minLength(1), Validators.required]],
      inputs: this.fb.array([]),
      currentStatus: [''],
    });
  }

  fillForm() {
    this.formGroup = this.fb.group({
      title: [
        this.taskObject?.title,
        [Validators.minLength(1), Validators.required],
      ],
      description: [
        this.taskObject?.description,
        [Validators.minLength(1), Validators.required],
      ],
      inputs: this.fb.array([]),
      currentStatus: this.taskObject?.status,
    });
    console.log(this.inputs);

    this.taskObject.subtasks?.forEach((sub) => {
      this.inputs.push(this.fb.control(sub.name));
    });
  }

  get inputs() {
    return this.formGroup.controls['inputs'] as FormArray;
  }

  addInput() {
    const inputForm = this.fb.control('new Subtask');
    this.inputs.push(inputForm);
  }

  collectInputValues() {
    const values = this.inputs.controls.map((control: any) => control.value);
    return values;
  }

  deleteInput(index: number) {
    this.inputs.removeAt(index);
  }

  createSubtaskObject(arr: any[]) {
    arr.forEach((value) => {
      let column: Subtask = {
        name: value,
        done: value.done ? value.done : false,
      };
      this.subTaskObject.push(column);
    });
  }

  submitForm() {
    const values = this.collectInputValues();
    this.createSubtaskObject(values);
    const taskValues = this.formGroup.value;
    if (this.formGroup.valid) {
      this.taskObject = {
        title: taskValues.title,
        description: taskValues.description,
        id: Math.random().toString(16).slice(2, 10),
        subtasks: this.subTaskObject,
        status: taskValues.currentStatus,
      };

      this.currentBoard?.columns.find((column) => {
        if (column.columnName === this.taskObject.status) {
          column.tasks.push(this.taskObject);
        }
      });

      this.popupService.closeAddTask();
    }
  }

  changeMode() {
    this.themeService.toggleTheme();
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
