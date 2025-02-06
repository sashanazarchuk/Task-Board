import { createFeatureSelector, createSelector } from "@ngrx/store";
import { listState } from "../models/listState";



export const selectListState = createFeatureSelector<listState>('lists');

export const listSelector = createSelector(
    selectListState,
    (state) => state.lists
);

export const selectorCurrentList = createSelector(
    selectListState,
    (state) => state.currentList
);

export const listIsLoadingSelector = createSelector(
    selectListState,
    (state) => state.isLoading
);


