import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Board, Task } from 'src/app/shared/models/board-interface';
import { BoardObjectService } from 'src/app/shared/services/add-board/board-object.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
  @Input() type: string = '';
  @Output() closePopUps = new EventEmitter<boolean>();

  constructor() {}

  closeObject() {
    this.closePopUps.emit(false);
  }
}
