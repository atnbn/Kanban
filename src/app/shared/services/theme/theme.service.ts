import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkModeSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private scrollSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();
  scroll$: Observable<boolean> = this.scrollSubject.asObservable();

  constructor() {
    const storedMode = localStorage.getItem('darkmode');

    if (storedMode === null) {
      this.setDarkMode(true);
    } else {
      this.setDarkMode(storedMode === 'true');
    }
  }

  toggleTheme() {
    const currentMode = this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(!currentMode);

    this.setDarkMode(!currentMode);
  }

  toggleScroll() {
    this.scrollSubject.next(!this.scrollSubject.value);
  }

  private setDarkMode(isDarkMode: boolean) {
    this.isDarkModeSubject.next(isDarkMode);

    // Save the current mode to local storage
    localStorage.setItem('darkmode', isDarkMode.toString());
  }
}
