import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OpenPopUpService } from '../../services/add-board/add-board-up.service';
import { ThemeService } from '../../services/theme/theme.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { BoardObjectService } from '../../services/add-board/board-object.service';
import { Board } from '../../models/board-interface';

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
  storage: any[] = [
    {
      title: 'Todo',
      id: '124914782',
      columns: [],
    },
  ];
  storedMode = localStorage.getItem('darkmode');
  boards: Board[] = [
    {
      title: 'Board',
      columns: [],
      id: '214414124',
    },
  ];

  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private boardService: BoardObjectService,
    private popupService: OpenPopUpService
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
    this.boardService.getBoardObjects().subscribe((objects) => {
      console.log(objects);
      if (objects.title) this.storage.push(objects);
    });

    this.popupService.addBoard$.subscribe((value) => {
      this.addBoardPopUp = value;
    });
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

  openId(id: number) {}
  closeAddBoard() {
    this.addBoardPopUp = false;
    console.log('Modal closed:', this.addBoardPopUp);
  }
}
