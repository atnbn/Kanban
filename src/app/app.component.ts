import { Component, OnInit } from '@angular/core';
import { AuthUserService } from './shared/services/user/login-user/login-user.service';
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
    this.authService.loading$.subscribe((bool: boolean) => {
      this.loading = bool;
    });
    if (!localStorage.getItem('lang')) {
      this.translate.setDefaultLang('en');
    } else {
      const currLang = localStorage.getItem('lang');
      this.translate.use(currLang!);
    }

    this.tr.currentLanguage$.subscribe((lang: string) => {
      if (lang !== '') this.translate.use(lang);
    });
  }
}
