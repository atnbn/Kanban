import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
