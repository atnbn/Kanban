import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: { [key: string]: any } = {};
  constructor() {
    // this.loadTranslations('en');
    // this.loadTranslations('de');
    // this.setDefaultLanguage();
  }

  // setDefaultLanguage() {
  //   if (!localStorage.getItem('lang')) this.currentLanguageSubject.next('en');
  //   else return;
  // }

  setLang(lang: string) {
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('lang', lang);
  }
}
