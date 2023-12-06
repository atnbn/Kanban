import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { BoardComponent } from './features/board/board.component';
import { AddBoardComponent } from './shared/components/add-board/add-board.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/components/header/header.component';
import AddTaskComponent from './shared/components/task/add-task/add-task.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditTaskComponent } from './shared/components/task/edit-task/edit-task.component';
import { DetailTaskComponent } from './shared/components/task/detail-task/detail-task.component';
import { FormsModule } from '@angular/forms';
import { DeletePopupComponent } from './shared/components/delete-popup/delete-popup.component';
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    BoardComponent,
    AddBoardComponent,
    HeaderComponent,
    AddTaskComponent,
    EditTaskComponent,
    DetailTaskComponent,
    DeletePopupComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
