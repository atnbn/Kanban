import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api/base-api.service';
import { Task } from '../../models/board-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService extends BaseApiService {
  createTask(task: Task, boardId: string, columnName: string): Observable<any> {
    return this.post(`api/create-task/${boardId}/${columnName}`, task);
  }

  updateTask(
    boardId: string,
    columName: string,
    taskId: string,
    taskData: Task
  ) {
    return this.put(
      `api/edit-task/${boardId}/${columName}/${taskId}`,
      taskData
    );
  }

  deleteTask(
    boardId: string,
    columnName: string,
    taskId: string
  ): Observable<any> {
    const url = `${this.apiUrl}api/delete-task/${boardId}/${columnName}/${taskId}`;
    return this.http.delete(url);
  }
}
