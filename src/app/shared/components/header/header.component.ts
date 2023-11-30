import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { SidebarService } from '../../services/sidebar/sidebar.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isDarkMode: boolean = false;
  addTaskPopUp: boolean = false;
  sidebarStatus: boolean = false;
  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
    this.sidebarService.sidebar$.subscribe((status) => {
      this.sidebarStatus = status;
    });
  }

  openAddTask() {
    this.addTaskPopUp = true;
  }

  closeAddTask() {
    this.addTaskPopUp = false;
    console.log('Modal closed:', this.addTaskPopUp);
  }
}
