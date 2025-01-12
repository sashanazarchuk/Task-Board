import { Injectable } from "@angular/core";
import { BASE_URL } from "../../../config";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { IHistory } from "../models/history";


@Injectable({
    providedIn: 'root'
})

export class HistoryService {

    private base = BASE_URL;

    constructor(private http: HttpClient) { }

    getHistory(boardId: number): Observable<IHistory[]> {
        return this.http.get<IHistory[]>(`${this.base}History/${boardId}`).pipe(
            catchError((error) => {
                console.error('Error fetching history:', error);
                return throwError(() => new Error('Failed to fetch history.'));
            })
        );
    }

}