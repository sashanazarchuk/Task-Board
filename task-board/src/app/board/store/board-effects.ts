import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardService } from '../services/board.service';
import * as BoardActions from './board-actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { IBoard } from '../models/board';

@Injectable()
export class BoardEffects {

    private actions$ = inject(Actions);

    constructor(private boardService: BoardService) { }

    loadAllBoard$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BoardActions.loadAllBoards),
            mergeMap(() =>
                this.boardService.getAllBoards().pipe(
                    map((boards) => BoardActions.loadAllBoardsSuccess({ boards })),
                    catchError((error) =>
                        of(BoardActions.loadAllBoardsFailure({ error: error.message }))
                    )
                )
            )
        )
    );


    loadBoardById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BoardActions.loadBoardById),
            mergeMap(({ boardId }) =>
                this.boardService.getBoardById(boardId).pipe(
                    map((board: IBoard) => BoardActions.loadBoardByIdSuccess({ board })),
                    catchError((error) => of(BoardActions.loadBoardByIdFailure({ error: error.message })))
                )
            )
        )
    );


    createBoard$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BoardActions.createBoard),
            mergeMap(({ board }) =>
                this.boardService.createBoard(board).pipe(
                    map((createdBoard: IBoard) => BoardActions.createBoardSuccess({ board: createdBoard })),
                    catchError((error) => of(BoardActions.createBoardFailure({ error: error.message })))
                )
            )
        )
    );


    editBoard$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BoardActions.editBoard),
            mergeMap(({ board }) =>
                this.boardService.editBoardName(board).pipe(
                    map((editedBoard: IBoard) => {
                        console.log('Edited board received:', editedBoard);
                        return BoardActions.editBoardSuccess({ board: editedBoard });
                    }),
                    catchError((error) => of(BoardActions.editBoardFailure({ error: error.message })))
                )
            )
        )
    );

    deleteBoard$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BoardActions.deleteBoard),
            mergeMap(action =>
                this.boardService.deleteBoard(action.boardId).pipe(
                    map(() => BoardActions.deleteBoardSuccess({ boardId: action.boardId })),
                    catchError((error) => of(BoardActions.deleteBoardFailure({ error })))
                )
            )
        )
    );

}
