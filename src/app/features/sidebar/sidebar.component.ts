import { Component, OnInit } from '@angular/core';
import { OpenPopUpService } from '../../shared/services/add-board/add-board-up.service';
import { ThemeService } from '../../shared/services/theme/theme.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { SidebarService } from '../../shared/services/sidebar/sidebar.service';
import { BoardObjectService } from '../../shared/services/add-board/board-object.service';
import { Board } from '../../shared/models/board-interface';
import { UserService } from 'src/app/shared/services/user/user/user.service';
import { SaveBoardService } from 'src/app/shared/services/save-board/save-board.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0%)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateX(-100%)' })
        ),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  isDarkMode: boolean = false;
  addBoardPopUp: boolean = false;
  sidebarState: boolean = true;
  currentUser: any = {};
  storage: Board[] = [];
  storedMode = localStorage.getItem('darkmode');
  boards: Board[] = [];

  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private boardService: BoardObjectService,
    private popupService: OpenPopUpService,
    private userService: UserService,
    private boardApiService: SaveBoardService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });

    this.boardService.getBoardObjects().subscribe((objects) => {
      if (Object.values(objects).length > 0) {
        this.storage.push(objects);
      }
    });

    this.boardService.submitStorage(this.storage);
    this.popupService.addBoard$.subscribe((value) => {
      this.addBoardPopUp = value;
    });

    this.userService.getUserData().subscribe({
      next: (response: any) => {
        this.currentUser = response.userData;
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.boardApiService.getBoardObjects().subscribe({
      next: (response) => {
        this.storage = response;
        this.boardService.submitDataToBoard(this.storage[0]);
      },
      error: (error) => {
        this.addPopUp();
      },
    });
  }

  addPopUp() {
    setTimeout(() => {
      this.addBoardPopUp = true;
    }, 1000);
  }

  changeMode() {
    this.themeService.toggleTheme();
  }

  toggleSidebar() {
    this.sidebarState = !this.sidebarState;
    this.sidebarService.toggleSidebar();
  }

  openAddBoard() {
    this.addBoardPopUp = true;
  }

  openId(id: string) {
    const foundObject = this.storage.find((obj) => obj.id === id);
    if (foundObject) {
      this.boardService.submitDataToBoard(foundObject);
    }
  }

  closeAddBoard() {
    this.addBoardPopUp = false;
  }
}
