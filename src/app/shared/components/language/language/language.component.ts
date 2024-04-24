import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import {
  LangChangeEvent,
  TranslateService,
  TranslationChangeEvent,
} from '@ngx-translate/core';
import { OpenPopUpService } from 'src/app/shared/services/add-board/add-board-up.service';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {
  isDarkMode: boolean = false;

  @Output() closePopUp = new EventEmitter<boolean>();
  @Output() languageChange = new EventEmitter<string>();

  constructor(
    private themeService: ThemeService,
    public translate: TranslateService,
    private popupService: OpenPopUpService,

    public ts: LanguageService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  setLanguage(lang: string) {
    this.ts.setLang(lang);
    this.closePopUp.emit(false);
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement.className.toLowerCase() === 'backdrop') {
      this.closePopUp.emit(false);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey() {
    this.closePopUp.emit(false);
  }
}
