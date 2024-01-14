import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class SaveBoardService extends BaseApiService {
  saveBoardObject(userData: any): Observable<any> {
    return this.post('api/create-board', userData);
  }

  editBoardObject(board: any, boardId: string): Observable<any> {
    return this.post(`api/edit-board/${boardId}`, board);
  }

  getBoardObjects(): Observable<any> {
    return this.get('api/get-boards');
  }

  deleteBoardObject(boardId: string): Observable<any> {
    return this.delete(`api/delete-board/${boardId}`);
  }
}
