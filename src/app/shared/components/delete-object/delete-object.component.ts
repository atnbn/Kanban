import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { Board, Task } from '../../services/models/board-interface';

@Component({
  selector: 'app-delete-object',
  templateUrl: './delete-object.component.html',
  styleUrls: ['./delete-object.component.scss'],
})
export class DeleteObjectComponent implements OnInit {
  isTask: boolean = false;
  isDarkMode: boolean = false;
  currentObject?: Task | Board;
  @Input() board?: Board;
  @Input() task?: Task;

  @Output() recivingObject = new EventEmitter<Task | Board>();
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });

    if (this.board !== undefined) {
      this.isTask = false;
      this.currentObject = this.board;
    }
    if (this.task !== undefined) {
      this.isTask = true;
      this.currentObject = this.task;
    }
  }
  deleteObject(id: any) {
    console.log(id);
  }

  closeDeleteWindow() {}
}
