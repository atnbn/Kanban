import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: { [key: string]: any } = {};
  constructor() {
    this.loadTranslations('en');
    this.loadTranslations('de');
  }

  setLanguage(language: string) {
    this.currentLanguageSubject.next(language);
  }

  getTranslation(key: string): string {
    return this.translations[this.currentLanguageSubject.value][key] || key;
  }

  private loadTranslations(language: string) {
    console.log(language);
    import(`../../../../assets/i18n/${language}.json`).then((translations) => {
      this.translations[language] = translations.default;
    });
  }
}
