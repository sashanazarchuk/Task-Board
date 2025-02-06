import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ListService } from "../services/list.service";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import * as ListActions from './list-actions'
import { ICardList } from "../models/list";

@Injectable()
export class CardListEffect {

    private actions$ = inject(Actions);

    constructor(private cardListService: ListService) { }
    
    loadListsByBoardId$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ListActions.loadListsByBoardId),
            mergeMap(({ boardId }) =>
                this.cardListService.fetchListByBoardId(boardId).pipe(
                    map(lists => ListActions.loadListsByBoardIdSuccess({ lists })),
                    catchError(error => of(ListActions.loadListsByBoardIdFailure({ error: error.message })))
                )
            )
        )
    );
    

    createCardList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ListActions.createList),
            mergeMap(({ list }) =>
                this.cardListService.createList(list).pipe(
                    map((createdList: ICardList) => ListActions.createListSuccess({ list: createdList })),
                    catchError((error) => of(ListActions.createListFailure({ error: error.message })))
                )
            )
        )
    );

    editCardList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ListActions.editList),
            mergeMap(({ list }) =>
                this.cardListService.editListName(list).pipe(
                    map((editedCardList: ICardList) => {
                        console.log('Edited card list received:', editedCardList);
                        return ListActions.editListSuccess({ list: editedCardList });
                    }),
                    catchError((error) => of(ListActions.editListFailure({ error: error.message })))
                )
            )
        )
    );

    deleteCardList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ListActions.deleteList),
            mergeMap(action =>
                this.cardListService.deleteList(action.listId).pipe(
                    map(() => ListActions.deleteListSuccess({ listId: action.listId })),
                    catchError((error) => of(ListActions.deleteListFailure({ error })))
                )
            )
        )
    );


}