import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { BASE_URL } from "../../../config";
import { IBoard } from "../models/board";

@Injectable({
  providedIn: 'root',
})

export class BoardService {

    private base = BASE_URL;

    constructor(private http: HttpClient) { }

    getBoardById(boardId: number): Observable<IBoard> {
        return this.http.get<IBoard>(`${this.base}Board/FetchBoard${boardId}`).pipe(
            catchError(error => {
                console.error('Error fetching card lists:', error);
                return throwError(() => new Error('Failed to fetch card lists'));
            })
        );
    }

    getAllBoards(): Observable<IBoard[]> {
        return this.http.get<IBoard[]>(`${this.base}Board/FetchAllBoards`).pipe(
            catchError(error => {
                console.error('Error fetching boards:', error);
                return throwError(() => new Error('Failed to fetch boards'));  
            })  
        );
    }

    createBoard(board: IBoard): Observable<IBoard> {
        return this.http.post<IBoard>(`${this.base}Board/CreateBoard`, board).pipe(
            catchError((error) => {
                console.error('Error creating board:', error);
                return throwError(() => new Error('Failed to create board'));
            })
        );
    }

    deleteBoard(boardId: number): Observable<IBoard> {
        return this.http.delete<IBoard>(`${this.base}Board/RemoveBoard/${boardId}`).pipe(
            catchError((error) => {
                console.error('Error deleting board:', error);
                return throwError(() => new Error('Failed to delete board'));
            })
        );
    }

    editBoardName(board: IBoard): Observable<IBoard> {
        return this.http.patch<IBoard>(`${this.base}Board/EditBoard/${board.boardId}`, board).pipe(
            catchError((error) => {
                console.error('Error editing board:', error);
                return throwError(() => new Error('Failed to edit board'));
            })
        );
    }


}