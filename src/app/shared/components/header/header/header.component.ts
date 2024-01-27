import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Board } from 'src/app/shared/models/board-interface';
import { OpenPopUpService } from 'src/app/shared/services/add-board/add-board-up.service';
import { BoardObjectService } from 'src/app/shared/services/add-board/board-object.service';
import { MediaQueryService } from 'src/app/shared/services/media-query/media-query.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isDarkMode: boolean = false;
  board: Board | undefined;
  isMobile: boolean = false;
  dropDown: boolean = false;
  storage: Board[] = [] as Board[];
  deleteWindow: boolean = false;
  routeSub!: Subscription;

  constructor(
    private themeService: ThemeService,
    private boardService: BoardObjectService,
    private mediaQueryService: MediaQueryService,
    private sidebarService: SidebarService,
    private popupService: OpenPopUpService,
    private route: ActivatedRoute
  ) {
    this.themeService.isDarkMode$.subscribe(
      (isDark) => (this.isDarkMode = isDark)
    );

    this.boardService.getBoard().subscribe((board: Board) => {
      this.board = board;
    });
    this.mediaQueryService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
    this.boardService.getStorage().subscribe((data) => {
      this.storage = data;
    });

    this.routeSub = this.route.queryParams.subscribe((params) => {
      const boardId = params['boardId'];
      if (boardId) {
        const foundObject = this.storage.find((obj) => obj.id === boardId);
        if (foundObject) {
          this.board = foundObject;
        }
      } else {
        this.board = this.storage[0];
      }
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
    console.log('test');
  }

  openAddTask(): void {
    this.popupService.openAddTask();
    this.boardService.submitBoard(this.board!);
    this.themeService.toggleScroll();
  }

  toggleSettings(): void {
    this.dropDown = !this.dropDown;
  }

  editBoard(): void {
    this.boardService.submitBoard(this.board!);
    this.popupService.openEditBoard();
    this.themeService.toggleScroll();
  }

  toggleDeleteWindow(): void {
    this.popupService.openDeleteBoard();
    this.boardService.submitBoard(this.board!);
    this.dropDown = false;
  }
}
