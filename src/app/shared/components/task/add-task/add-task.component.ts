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
import { Board, Columns, Status, Task } from '../../../models/board-interface';
import { BoardObjectService } from '../../../services/add-board/board-object.service';
import { TaskApiService } from 'src/app/shared/services/add-task/add-task-api.service';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export default class AddTaskComponent implements OnInit {
  taskObject!: Task;
  edit: boolean = false;
  modalOpen: boolean = true;
  isLoading: boolean = false;
  formGroup!: FormGroup;
  isDarkMode: boolean = false;
  currentTask!: Task;
  currentBoard!: Board;
  newStatus: Status = {
    id: '',
    columnName: '',
  };
  subTaskObject: any[] = [];
  @Input() type: string = '';
  @Output() closePopUp = new EventEmitter<boolean>();
  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private boardService: BoardObjectService,
    private taskApiService: TaskApiService,
    private messageService: ReturnMessageService
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
    if (this.type === 'edit') {
      this.boardService.getTask().subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.currentTask = data;
          console.log(this.currentTask);
        }
      });
    }

    this.boardService.getBoard().subscribe((data) => {
      if (Object.keys(data).length > 0) {
        this.currentBoard = data;
      }
    });

    if (this.type === 'create') {
      this.initializeForm();
    } else if (this.type === 'edit') {
      this.fillForm();
      this.edit = true;
    }
  }

  initializeForm() {
    const firstColumn = this.currentBoard.columns[0];
    this.formGroup = this.fb.group({
      title: ['', [Validators.minLength(1), Validators.required]],
      description: ['', [Validators.minLength(1), Validators.required]],
      inputs: this.fb.array([]),
      selectedColumnId: firstColumn.id,
      status: this.fb.group([
        {
          id: firstColumn.id,
          columnName: firstColumn.columnName,
        },
      ]),
    });
  }

  fillForm() {
    this.formGroup = this.fb.group({
      title: [
        this.currentTask?.title,
        [Validators.minLength(1), Validators.required],
      ],
      description: [
        this.currentTask?.description,
        [Validators.minLength(1), Validators.required],
      ],
      inputs: this.fb.array([]),
      selectedColumnId: this.currentTask.status[0].id,

      status: [
        {
          id: this.currentTask?.status[0].id,
          columnName: this.currentTask?.status[0].columnName,
        },
      ],
    });
    console.log(this.formGroup.value);

    this.currentTask.subtasks?.forEach((sub) => {
      this.inputs.push(
        this.fb.group({
          name: [sub.name, [Validators.minLength(1), Validators.required]],
          done: [sub.done],
          id: [sub.id],
        })
      );
    });
  }

  get status() {
    return this.formGroup.controls['status'] as FormArray;
  }

  addColumns() {
    this.currentBoard.columns.forEach((column) => {
      const newColumn = this.fb.group({
        name: [column.columnName],
        id: [column.id],
      });
      this.status.push(newColumn);
    });
  }

  get inputs() {
    return this.formGroup.controls['inputs'] as FormArray;
  }

  changeTask() {
    this.currentBoard.columns.forEach((column) => {
      if (column.id === this.newStatus.id) {
        this.newStatus.columnName = column.columnName;
      }
    });
  }

  addInput() {
    const inputForm = this.fb.group({
      name: ['New Subtask', [Validators.minLength(1), Validators.required]],
      done: [false],
      id: [Math.random().toString(16).slice(2, 10)],
    });
    this.inputs.push(inputForm);
  }

  checkValidator(formControlName: string, errorType: string) {
    const control = this.formGroup.get(formControlName);
    return control?.hasError(errorType) && control.touched;
  }

  deleteInput(index: number) {
    this.inputs.removeAt(index);
  }

  createTaskObject() {
    const taskValues = this.formGroup.value;
    this.taskObject = {
      title: taskValues.title,
      description: taskValues.description,
      id: this.currentTask?.id || Math.random().toString(16).slice(2, 10),
      subtasks: this.inputs.value,
      status: [
        {
          id: this.newStatus.id || this.currentBoard.columns[0].id,
          columnName:
            this.newStatus.columnName ||
            this.currentBoard.columns[0].columnName,
        },
      ],
    };
  }

  createTask(event: Event) {
    event.preventDefault();
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
    } else {
      this.isLoading = true;
      this.createTaskObject();
      this.currentBoard?.columns.find((column) => {
        if (column.id === this.taskObject.status[0].id) {
          column.tasks.push(this.taskObject);
          this.taskApiService
            .createTask(this.taskObject, this.currentBoard.id, column.id)
            .subscribe({
              next: (response: any) => {
                this.isLoading = false;
                this.messageService.setMessage({
                  message: response.message,
                  type: 'success',
                });
                this.closePopUp.emit(false);
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
      });
    }
  }

  findBoard(currentColumn: Columns) {
    const boarId = this.currentBoard.id;
  }

  updateTask(event: Event) {
    event.preventDefault();
    if (this.edit && this.formGroup.valid) {
      this.createTaskObject();
      console.log(this.taskObject.status[0].id);
      const currentColumn = this.findColumnContainingTask(this.taskObject);

      if (currentColumn) {
        const taskToUpdate = currentColumn.tasks.find(
          (task) => task.id === this.taskObject.id
        );

        this.moveTask(this.taskObject, this.taskObject.status[0].id);
        if (taskToUpdate) {
          taskToUpdate.title = this.taskObject.title;
          taskToUpdate.description = this.taskObject.description;
          taskToUpdate.status[0] = this.newStatus;
          console.log(taskToUpdate.status[0].id);
          this.taskApiService
            .updateTask(
              this.currentBoard.id,
              currentColumn.id,
              this.taskObject.id,
              taskToUpdate
            )
            .subscribe({
              next: (response: any) => {
                this.messageService.setMessage({
                  message: response.message,
                  type: 'success',
                });
              },
              error: (error) => {
                this.messageService.setMessage({
                  message: error.error,
                  type: 'error',
                });
              },
            });
        }
      }
    }
    this.closePopUp.emit(true);
    this.boardService.submitTask(this.taskObject);
  }
  onColumnSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement | null;
    if (selectElement && selectElement.value) {
      const selectedColumnId = selectElement.value;
      const column = this.currentBoard.columns.find(
        (c) => c.id === selectedColumnId
      );
      if (column) {
        this.formGroup.patchValue({
          status: {
            id: column.id,
            columnName: column.columnName,
          },
        });
        this.newStatus = {
          id: column.id,
          columnName: column.columnName,
        };
      }
    }
  }

  private moveTask(task: Task, newStatus: string) {
    const currentColumn = this.findColumnContainingTask(task);
    console.log('newStatus', newStatus);
    if (currentColumn && currentColumn.id !== newStatus) {
      // Remove task from current column
      currentColumn.tasks = currentColumn.tasks.filter((t) => t.id !== task.id);
      // Find the new column
      const newColumn = this.currentBoard.columns.find(
        (column) => column.id === newStatus
      );

      if (newColumn) {
        newColumn.tasks.push(this.taskObject);

        // Update the task status
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

  getCompletedSubtaskCount() {
    return this.currentTask?.subtasks?.filter((subtask) => subtask.done).length;
  }

  submitForm(event: Event) {
    if (!this.edit) {
      this.createTask(event);
    } else {
      this.updateTask(event);
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
