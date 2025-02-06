import { createAction, props } from "@ngrx/store";
import { ICardList } from "../models/list";


//Load Lists by Board Id
export const loadListsByBoardId = createAction('[List] Load Lists By Board Id', props<{ boardId: number }>());
export const loadListsByBoardIdSuccess = createAction('[List] Load Lists By Board Id Success', props<{ lists: ICardList[] }>());
export const loadListsByBoardIdFailure = createAction( '[List] Load Lists By Board Id Failure', props<{ error: string }>());

//Create List
export const createList = createAction('[List] Create List', props<{ list: ICardList }>())
export const createListSuccess = createAction('[List] Create List Success', props<{ list: ICardList }>());
export const createListFailure = createAction('[List] Create List Failure', props<{ error: string }>());

//Edit List
export const editList = createAction('[List] Edit List', props<{ list: ICardList }>())
export const editListSuccess = createAction('[List] Edit List Success', props<{ list: ICardList }>());
export const editListFailure = createAction('[List] Edit List Failure', props<{ error: string }>())

//Delete List
export const deleteList = createAction('[List] Delete List', props<{ listId: number }>())
export const deleteListSuccess = createAction('[List] Delete List Success', props<{ listId: number }>())
export const deleteListFailure = createAction('[List] Delete List Failure', props<{ error: string }>());

