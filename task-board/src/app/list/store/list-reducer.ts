import { createReducer, on } from "@ngrx/store";
import { listState } from "../models/listState";
import * as ListActions from './list-actions'

export const initialState: listState = {
    isLoading: false,
    lists: [],
    currentList: null,
    error: null
}


export const listReducer = createReducer(
    initialState,

    // Load Lists By BoardId
    on(ListActions.loadListsByBoardId, (state) => ({
        ...state,
        isLoading: true
    })),
    on(ListActions.loadListsByBoardIdSuccess, (state, { lists }) => ({
        ...state,
        lists,
        isLoading: false
    })),
    on(ListActions.loadListsByBoardIdFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),


    // Create List
    on(ListActions.createList, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(ListActions.createListSuccess, (state, { list }) => ({
        ...state,
        isLoading: false,
        lists: [...state.lists, list]
    })),

    on(ListActions.createListFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),



    // Edit List
    on(ListActions.editList, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(ListActions.editListSuccess, (state, { list }) => ({
        ...state,
        isLoading: false,
        lists: state.lists.map(l => l.cardListId === list.cardListId ? { ...l, ...list } : l),
        currentList: list
    })),

    on(ListActions.editListFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),



    // Delete List
    on(ListActions.deleteList, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(ListActions.deleteListSuccess, (state, { listId }) => ({
        ...state,
        isLoading: false,
        lists: state.lists.filter(list => list.cardListId !== listId),
        currentList: state.currentList?.cardListId === listId ? null : state.currentList,
    })),

    on(ListActions.deleteListFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),
);
