import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BASE_URL } from "../../../config";
import { ICardList } from "../models/list";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class ListService {

    private base = BASE_URL;

    constructor(private http: HttpClient) { }

    editListName(cardList: ICardList): Observable<ICardList> {
        return this.http.patch<ICardList>(`${this.base}CardList/EditList/${cardList.cardListId}`, cardList).pipe(
            catchError(error => {
                console.error('Error updating list name:', error);
                return throwError(error);
            })
        );
    }

    deleteList(cardListId: number): Observable<ICardList> {
        return this.http.delete<ICardList>(`${this.base}CardList/RemoveList/${cardListId}`).pipe(
            catchError(error => {
                console.error('Error deleting list:', error);
                return throwError(error);
            })
        );
    }

    createList(cardList: ICardList): Observable<ICardList> {
        return this.http.post<ICardList>(`${this.base}CardList/CreateList`, cardList).pipe(
            catchError(error => {
                console.error('Error creating list:', error);
                return throwError(error);
            })
        );
    }

    fetchListByBoardId(boardId: number): Observable<ICardList[]> {
        return this.http.get<ICardList[]>(`${this.base}CardList/FetchListsByBoardId/${boardId}`).pipe(
            catchError(error => {
                console.error('Error fetching lists:', error);
                return throwError(error);
            })
        );
    }
}