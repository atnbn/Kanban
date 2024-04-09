import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { BoardComponent } from './features/board/board.component';
import { AddBoardComponent } from './shared/components/add-board/add-board.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import AddTaskComponent from './shared/components/task/add-task/add-task.component';
import { ReactiveFormsModule } from '@angular/forms';

import { DetailTaskComponent } from './shared/components/task/detail-task/detail-task.component';
import { FormsModule } from '@angular/forms';
import { DeleteObjectComponent } from './shared/components/delete-object/delete-object.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { MatInputModule } from '@angular/material/input';
import { HomeComponent } from './features/home/home.component';
import { NotificationComponent } from './shared/components/notification/notification/notification.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PopupComponent } from './shared/components/popup/popup/popup.component';
import { HeaderComponent } from './shared/components/header/header/header.component';

import { LanguageComponent } from './shared/components/language/language/language.component';
import { TranslationPipe } from './shared/pipes/translation/translation.pipe';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    TranslationPipe,
    SidebarComponent,
    BoardComponent,
    AddBoardComponent,
    AddTaskComponent,
    DetailTaskComponent,
    DeleteObjectComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NotificationComponent,
    PopupComponent,
    LanguageComponent,
    HeaderComponent,
    TranslationPipe,
    SpinnerComponent,
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
    MatSidenavModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
