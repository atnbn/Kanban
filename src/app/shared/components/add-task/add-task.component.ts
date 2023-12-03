import {
  Component,
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
import { Board, Task } from '../../models/board-interface';
import { BoardObjectService } from '../../services/add-board/board-object.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export default class AddTaskComponent implements OnInit {
  modalOpen: boolean = true;
  formGroup!: FormGroup;
  isDarkMode: boolean = false;
  currentBoard!: Board;

  @Output() closePopUp = new EventEmitter<boolean>();
  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private boardService: BoardObjectService
  ) {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
    this.boardService.sidebarData$.subscribe((data) => {
      if (Object.keys(data).length > 0) {
        this.currentBoard = data;
        console.log('addtask object', data);
      }
    });
  }
  ngOnInit(): void {
    // this.initializeForm();
  }
  initializeForm() {
    this.formGroup = this.fb.group({
      title: ['', Validators.minLength(1), Validators.required],
      description: ['', Validators.minLength(1), Validators.required],
      subtask: this.fb.array([]),
    });
  }

  get subTasks() {
    return this.formGroup?.get('subtasks') as FormArray;
  }

  createSubTask() {
    const newSubTask = this.fb.control('New Subtask');
    this.subTasks.push(newSubTask);
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
