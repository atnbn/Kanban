import { Component, OnInit } from '@angular/core';
import { OpenPopUpService } from './shared/services/add-board/add-board-up.service';
import { ThemeService } from './shared/services/theme/theme.service';
import { SidebarService } from './shared/services/sidebar/sidebar.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Board } from './shared/models/board-interface';
import { BoardObjectService } from './shared/services/add-board/board-object.service';
import { CreateUserService } from './shared/services/user/create-user/create-user.service';
import { environment } from 'src/environments/environment';
import { ServerStatusService } from './shared/services/server-status/server-status.service';
import { AuthUserService } from './shared/services/user/login-user/login-user.service';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isStarting: boolean = false;
  title = 'Project';

  constructor(
    private severStatus: ServerStatusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.severStatus.checkServerStatus().subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.router.navigate(['/server']);
      },
    });
  }
}
