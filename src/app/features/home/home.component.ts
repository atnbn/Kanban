import {
  ChangeDetectorRef,
  Component,
  HostListener,
  ViewChild,
} from '@angular/core';
import { BoardObjectService } from 'src/app/shared/services/add-board/board-object.service';
import { Board, Task } from 'src/app/shared/models/board-interface';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';
import { Message } from 'src/app/shared/models/notification-interface';
import { MatSidenav } from '@angular/material/sidenav';
import { OpenPopUpService } from 'src/app/shared/services/add-board/add-board-up.service';
import { SaveBoardService } from 'src/app/shared/services/save-board/save-board.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  mobileQuery: MediaQueryList;
  type: string = '';
  messageObject: Message = {} as Message;
  message: string = '';
  showMessage: boolean = false;
  messageType: string = '';
  sidebar: boolean = true;
  openPopup: boolean = false;
  isDarkMode: boolean = false;
  scrollDisabled: boolean = false;
  sidebarState: string = 'in';
  currentTask: Task = {} as Task;
  currentBoard: Board = {} as Board;
  boards: Board[] = [];
  emptyBoard: boolean = true;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private _mobileQueryListener: () => void;
  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private boardService: BoardObjectService,
    private messageService: ReturnMessageService,
    changeDetectorRef: ChangeDetectorRef,
    private popupService: OpenPopUpService,
    private boardApiService: SaveBoardService
  ) {
    this.mobileQuery = window.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
    this.sidebarService.sidebar$.subscribe((data: boolean) => {
      if (this.mobileQuery.matches) {
        this.sidebar = !data;
      } else {
        this.sidebar = data;
      }
    });

    this.boardApiService.getBoardObjects().subscribe({
      next: (response) => {
        if (Object.keys(response).length !== 0) {
          this.boards = response;
          this.emptyBoard = false;
          this.boardService.submitStorage(response);
          this.boardService.submitBoard(response[0]);
        } else {
          this.emptyBoard = true;
          this.popupService.openAddBoard();
        }
      },
      error: (error) => {},
    });
    this.boardService.storage$.subscribe((boards: Board[]) => {
      this.boards = boards;
      if (Object.keys(boards).length !== 0) {
        this.emptyBoard = false;
      } else {
        this.emptyBoard = true;
      }
    });

    this.themeService.scroll$.subscribe((scroll) => {
      this.scrollDisabled = scroll;
    });

    this.messageService.message$.subscribe((object: any) => {
      if (object.message !== '') {
        this.messageObject = object;
        this.showMessage = true;
        this.setTimer();
      }
    });

    this.popupService.addBoard$.subscribe((data: boolean) => {
      if (data) {
        this.openPopup = data;
        this.type = 'create-board';
      }
    });
    this.popupService.editBoard$.subscribe((data: boolean) => {
      if (data) {
        this.openPopup = data;
        this.type = 'edit-board';
      }
    });

    this.popupService.deleteBoard$.subscribe((data: boolean) => {
      if (data) {
        this.openPopup = data;
        this.type = 'delete-board';
      }
    });

    this.popupService.addTask$.subscribe((data: boolean) => {
      if (data) {
        this.openPopup = data;
        this.type = 'create-task';
      }
    });
    this.popupService.editTask$.subscribe((data: boolean) => {
      if (data) {
        this.openPopup = data;
        this.type = 'edit-task';
      }
    });

    this.popupService.detailTask$.subscribe((data: boolean) => {
      if (data) {
        this.openPopup = data;
        this.type = 'detail-task';
      }
    });

    this.popupService.deleteTask$.subscribe((data: boolean) => {
      if (data) {
        this.openPopup = data;
        this.type = 'delete-task';
      }
    });
    this.popupService.deleteUser$.subscribe((data: boolean) => {
      if (data) {
        this.openPopup = data;
        this.type = 'delete-user';
      }
    });

    this.popupService.changeLanguage$.subscribe((data: boolean) => {
      if (data) {
        this.openPopup = data;
        this.type = 'language';
      }
    });
  }
  closeObjects() {
    this.openPopup = false;
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  changeSidebar() {
    this.sidebar = !this.sidebar;
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

  openBoard() {
    this.popupService.openAddBoard();
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    // const backdrop = clickedElement.className.toLowerCase().split(' ')[0];
    const backdrop = clickedElement.tagName.toLowerCase();
    if (backdrop === 'section') {
      this.openPopup = false;
      if (this.mobileQuery.matches) this.sidebar = false;
    }
  }
}
