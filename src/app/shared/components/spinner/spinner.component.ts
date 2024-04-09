import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  isSleeping: boolean = false;
  constructor(private router: Router) {
    this.redirect();
  }

  wakeUp() {
    this.isSleeping = true;
    this.redirect();
    setTimeout(() => {
      this.isSleeping = false;
    }, 2000);
  }

  redirect() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 8000);
  }
}
