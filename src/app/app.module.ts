import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { BoardComponent } from './features/board/board.component';
import { AddBoardComponent } from './shared/components/add-board/add-board.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import AddTaskComponent from './shared/components/task/add-task/add-task.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditTaskComponent } from './shared/components/task/edit-task/edit-task.component';
import { DetailTaskComponent } from './shared/components/task/detail-task/detail-task.component';
import { FormsModule } from '@angular/forms';
import { DeleteObjectComponent } from './shared/components/delete-object/delete-object.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    BoardComponent,
    AddBoardComponent,
    AddTaskComponent,
    EditTaskComponent,
    DetailTaskComponent,
    DeleteObjectComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
