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
import {
  Board,
  Columns,
  Subtask,
  Task,
} from '../../../services/models/board-interface';
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
    private boardService: BoardObjectService
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

  deleteInput(index: number) {
    this.inputs.removeAt(index);
  }

  createSubtaskObject() {
    const values = this.inputs.controls.map((control: any) => control.value);

    values.forEach((value) => {
      let subtask: Subtask = {
        name: value,
        done: value.done || false,
        id: value.id || Math.random().toString(16).slice(2, 10),
      };
      this.subTaskObject.push(subtask);
    });
  }

  createTaskObject() {
    this.createSubtaskObject();
    const taskValues = this.formGroup.value;
    this.taskObject = {
      title: taskValues.title,
      description: taskValues.description,
      id: this.currentTask?.id || Math.random().toString(16).slice(2, 10),
      subtasks: this.subTaskObject,
      status: taskValues.currentStatus,
    };
    console.log(this.taskObject);
  }

  createTask() {
    if (this.formGroup.invalid) return;

    this.createTaskObject();
    this.currentBoard?.columns.find((column) => {
      if (column.columnName === this.taskObject.status) {
        column.tasks.push(this.taskObject);
      }
    });
  }

  updateTask() {
    if (this.edit && this.formGroup.valid) {
      this.createTaskObject();
      this.moveTask(this.taskObject, this.taskObject.status);

      const currentColumn = this.findColumnContainingTask(this.taskObject);

      if (currentColumn) {
        const taskToUpdate = currentColumn.tasks.find(
          (task) => task.id === this.taskObject.id
        );

        if (taskToUpdate) {
          taskToUpdate.title = this.taskObject.title;
          taskToUpdate.description = this.taskObject.description;
          taskToUpdate.status = this.taskObject.status;
        }
      }
    }
    this.closePopUp.emit(true);
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

  submitForm() {
    if (!this.edit) {
      this.createTask();
    } else {
      this.updateTask();
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
