import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { OpenPopUpService } from '../../shared/services/add-board/add-board-up.service';
import { ThemeService } from '../../shared/services/theme/theme.service';
import { SidebarService } from '../../shared/services/sidebar/sidebar.service';
import { BoardObjectService } from '../../shared/services/add-board/board-object.service';
import { Board } from '../../shared/models/board-interface';
import { UserService } from 'src/app/shared/services/user/user/user.service';
import { SaveBoardService } from 'src/app/shared/services/save-board/save-board.service';

import { ActivatedRoute, Router } from '@angular/router';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  dropDown: boolean = false;
  isDarkMode: boolean = false;
  addBoardPopUp: boolean = false;
  sidebarState: boolean = true;
  currentUser: any = {};
  storage: Board[] = [];
  storedMode = localStorage.getItem('darkmode');
  boards: Board[] = [];
  routeSub!: Subscription;
  activeBoard: Board | null = {} as Board;
  active: boolean = true;
  render: boolean = false;
  language: boolean = false;
  private _mobileQueryListener: () => void;

  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private boardService: BoardObjectService,
    private popupService: OpenPopUpService,
    private userService: UserService,
    private boardApiService: SaveBoardService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: ReturnMessageService,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = window.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
    const storage$ = this.boardService.getStorage();
    const queryParams$ = this.route.queryParams;

    const combined$ = combineLatest([storage$, queryParams$]).subscribe(
      ([objects, params]) => {
        if (objects.length > 0) {
          this.storage = objects;
          this.setActiveBoard(params['boardId']);
          if (!params['boardId']) {
            this.setBoardIfNoParam();
          }
        }
      }
    );

    this.routeSub = combined$;
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  setBoardIfNoParam() {
    this.activeBoard = this.storage[0];
    this.router.navigate([], {
      queryParams: { boardId: this.activeBoard.id },
      queryParamsHandling: 'merge',
    });
  }

  setActiveBoard(boardId: string) {
    if (boardId && this.storage.length > 0) {
      const foundBoard = this.storage.find((board) => board.id === boardId);
      if (foundBoard) {
        this.activeBoard = foundBoard;
      } else {
        this.activeBoard = null; // Or handle the error as you see fit
      }
    } else {
      this.activeBoard = null;
    }
  }

  addPopUp() {
    setTimeout(() => {
      this.addBoardPopUp = true;
    }, 1000);
  }

  changeMode() {
    this.themeService.toggleTheme();
  }
  openSettings() {
    this.dropDown = !this.dropDown;
  }
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  openAddBoard() {
    this.popupService.openAddBoard();
    if (this.mobileQuery.matches) {
      this.toggleSidebar();
    } else {
    }
  }

  openLanguagePopUp() {
    this.popupService.openChangeLanguage();
    this.dropDown = false;
  }
  // triggerLanguage() {
  //   this.popupService.openChangeLanguage();
  //   // this.language = !this.language;
  // }
  openId(id: string) {
    this.router.navigate([], {
      queryParams: { boardId: id },
      queryParamsHandling: 'merge',
    });
  }
  openDeletePopUp() {
    this.popupService.openDeleteUser();
  }

  closeAddBoard() {
    this.addBoardPopUp = false;
  }

  logout() {
    this.userService.logout().subscribe({
      next: (response) => {
        this.messageService.setMessage({
          message: response.message,
          type: 'success',
        });
        this.router.navigate(['login']);
      },
      error: (error) => {
        this.messageService.setMessage({
          message: error.error,
          type: 'error',
        });
      },
    });
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const dropDown = clickedElement.tagName.toLowerCase();
    if (dropDown === 'div' && this.dropDown === true) {
      this.dropDown = false;
    } else return;
  }
}
