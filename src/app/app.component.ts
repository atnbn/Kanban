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
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './shared/services/language/language.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isStarting: boolean = false;
  title = 'Project';
  loading: boolean = false;
  constructor(
    private authService: AuthUserService,
    private translate: TranslateService,
    private tr: LanguageService
  ) {}

  ngOnInit(): void {
    this.authService.loading$.subscribe(
      (bool: boolean) => (this.loading = bool)
    );
    if (!localStorage.getItem('lang')) {
      console.log('add default lang');
      this.translate.setDefaultLang('en');
    } else {
      const currLang = localStorage.getItem('lang');
      console.log('curr lang', currLang);
      this.translate.use(currLang!);
    }

    this.tr.currentLanguage$.subscribe((lang: string) => {
      console.log(lang);
      if (lang !== '') this.translate.use(lang);
    });
  }
}
