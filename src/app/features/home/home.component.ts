import { Component, ViewChild } from '@angular/core';
import { BoardObjectService } from 'src/app/shared/services/add-board/board-object.service';
import { Board } from 'src/app/shared/models/board-interface';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';
import { Message } from 'src/app/shared/models/notification-interface';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // hier bist du stehen geblieben :D
  messageObject: Message = {} as Message;
  message: string = '';
  showMessage: boolean = false;
  messageType: string = '';
  sidebar: boolean = true;
  isDarkMode: boolean = false;
  sidebarState: string = 'in';
  boards: Board[] = [];
  emptyBoard: boolean = false;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private boardService: BoardObjectService,
    private messageService: ReturnMessageService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
    this;
    this.sidebarService.sidebar$.subscribe(() => {
      if (this.sidenav) {
        this.sidenav.toggle();
        this.sidebar = !this.sidebar;
      }
    });
    this.boardService.sidebarData$.subscribe((boards) => {
      if (Object.keys(boards).length !== 0) {
        this.boards.push(boards);
        this.emptyBoard = false;
      } else {
        this.emptyBoard = true;
      }
    });

    this.messageService.message$.subscribe((object: any) => {
      console.log(object);
      if (object.message !== '') {
        this.messageObject = object;
        this.showMessage = true;
        this.setTimer();
      }
    });
  }

  changeSidebar() {
    this.sidebar = !this.sidebar;
    console.log(this.sidebar);
    this.sidenav.toggle();
  }
  setTimer() {
    setTimeout(() => {
      this.showMessage = false;
      this.messageObject = {
        message: '',
        type: '',
      };
    }, 3500);
  }
}
