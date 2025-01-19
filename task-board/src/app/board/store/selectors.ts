import { createSelector } from "@ngrx/store";
import { AppState } from "../../types/appState";

export const selectBoardsState = (state: AppState) => state.boards;
export const selectCurrentBoardId = (state: AppState) => state.boards.currentBoard?.boardId ?? null;


export const isLoadingSelector = createSelector(
    selectBoardsState,
    (state) => state.isLoading
)

export const boardSelector = createSelector(
    selectBoardsState,
    (state) => state.boards
)

export const getBoardByIdSelector = createSelector(
    selectBoardsState,
    selectCurrentBoardId,
    (boardsState, currentBoardId) => {
        if (!currentBoardId) return null;
        return boardsState.boards.find(board => board.boardId === currentBoardId) || null;
    }
);

