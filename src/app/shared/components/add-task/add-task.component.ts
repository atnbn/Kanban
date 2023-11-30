import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export default class AddTaskComponent {
  modalOpen: boolean = true;
  isDarkMode: boolean = false;
  @Output() closePopUp = new EventEmitter<boolean>();
  subtasks = [
    { name: 'e.g. Make coffee ' },
    {
      name: 'e.g. Drink coffee & smile',
    },
  ];
  constructor(private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
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
