import { createAction, props } from "@ngrx/store";
import { IBoard } from "../models/board";

//Load All Boards
export const loadAllBoards = createAction('[Board] Load Boards');
export const loadAllBoardsSuccess = createAction('[Board] Load Boards Success', props<{ boards: IBoard[] }>());
export const loadAllBoardsFailure = createAction('[Board] Load Boards Failure', props<{ error: string }>());

//Load Board by ID
export const loadBoardById = createAction('[Board] Load Board By Id', props<{ boardId: number }>());
export const loadBoardByIdSuccess = createAction('[Board] Load Board By Id Success', props<{ board: IBoard }>());
export const loadBoardByIdFailure = createAction('[Board] Load Board By Id Failure', props<{ error: string }>());

//Create Board
export const createBoard = createAction('[Board] Create Board', props<{ board: IBoard }>())
export const createBoardSuccess = createAction('[Board] Create Board Success', props<{ board: IBoard }>());
export const createBoardFailure = createAction('[Board] Create Board Failure', props<{ error: string }>());

//Edit Board
export const editBoard = createAction('[Board] Edit Board', props<{ board: IBoard }>())
export const editBoardSuccess = createAction('[Board] Edit Board Success', props<{ board: IBoard }>());
export const editBoardFailure = createAction('[Board] Edit Board Failure', props<{ error: string }>())

//Delete Board
export const deleteBoard = createAction('[Board] Delete Board', props<{ boardId: number }>())
export const deleteBoardSuccess = createAction('[Board] Delete Board Success', props<{ boardId: number }>())
export const deleteBoardFailure = createAction('[Board] Delete Board Failure', props<{ error: string }>());