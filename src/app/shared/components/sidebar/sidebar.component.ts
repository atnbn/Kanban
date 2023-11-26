import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OpenPopUpService } from '../../services/add-board/add-board-up.service';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isDarkMode: boolean = false;
  modalOpen: boolean = false;
  sidebarState: boolean = true;
  storedMode = localStorage.getItem('darkmode');
  boards = [];
  collection = [
    {
      boardName: 'Conquerer',
      icon: '/assets/images/icon-board.svg',
    },
    {
      boardName: 'Conquerer',
      icon: '/assets/images/icon-board.svg',
    },
  ];

  constructor(
    private modulService: OpenPopUpService,
    private themeService: ThemeService
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
  }
  changeMode() {
    this.themeService.toggleTheme();
  }

  toggleSidebar() {
    this.sidebarState = !this.sidebarState;
  }

  openModal() {
    this.modulService.openModal();
    this.modalOpen = true;
    console.log('test');
  }

  createNewBoard() {
    // const newBoard = {
    //     title:
    // }
  }

  closeModal() {
    this.modalOpen = false;
    console.log('Modal closed:', this.modalOpen);
  }
}
