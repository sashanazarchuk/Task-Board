import { Injectable } from "@angular/core";
import { BASE_URL } from "../../../config";
import { HttpClient } from "@angular/common/http";
import { ICard } from "../models/card";
import { catchError, Observable, throwError } from "rxjs";
import { IActivity } from "../models/activity";


@Injectable({
    providedIn: 'root'
})

export class CardService {

    private base = BASE_URL;

    constructor(private http: HttpClient) { }


    getCardById(cardId: number): Observable<ICard> {
        return this.http.get<ICard>(`${this.base}Card/FetchCard/${cardId}`).pipe(
            catchError((error) => {
                console.error('Error fetching card by ID:', error);
                return throwError(() => new Error('Failed to fetch card by ID.'));
            })
        );
    }

    createCard(card: ICard): Observable<ICard> {
        return this.http.post<ICard>(`${this.base}Card/CreateCard`, card).pipe(
            catchError((error) => {
                console.error('Error creating card:', error);
                return throwError(() => new Error('Failed to create card.'));
            })
        );
    }

    updateCard(card: ICard): Observable<ICard> {
        return this.http.patch<ICard>(`${this.base}Card/EditItem/${card.cardId}`, card).pipe(
            catchError((error) => {
                console.error('Error editing card:', error);
                return throwError(() => new Error('Failed to edit card.'));
            })
        );
    }

    deleteCard(cardId: number): Observable<ICard> {
        return this.http.delete<ICard>(`${this.base}Card/RemoveCard/${cardId}`).pipe(
            catchError((error) => {
                console.error('Error deleting card:', error);
                return throwError(() => new Error('Failed to delete card.'));
            })
        );
    }

    getActivities(cardId: number): Observable<IActivity[]> {
        return this.http.get<IActivity[]>(`${this.base}Activity/${cardId}`).pipe(
            catchError((error) => {
                console.error('Error fetching activities:', error);
                return throwError(() => new Error('Failed to fetch activities.'));
            })
        );
    }

}