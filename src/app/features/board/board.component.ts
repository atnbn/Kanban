import { Component } from '@angular/core';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  isDarkMode: boolean = false;
  columns = [
    {
      name: 'todo',
      tasks: [
        {
          title: 'aufräumen',
          description: 'gründlich aufräumen',
          status: 'todo',
        },
      ],
    },
    {
      name: 'doing',
      tasks: [
        {
          title: 'aufräumen',
          description: 'gründlich aufräumen',
          status: 'todo',
        },
      ],
    },
  ];
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((darkmode) => {
      this.isDarkMode = darkmode;
    });
  }
}
