import { createReducer, on } from "@ngrx/store";
import { boardState } from "../models/boardState";
import * as BoardActions from './actions'

export const initialState: boardState = {
    isLoading: false,
    boards: [],
    currentBoard: null,
    error: null
}


export const boardReducer = createReducer(
    initialState,

    // Load All Boards
    on(BoardActions.loadAllBoards, (state) => ({
        ...state,
        isLoading: true,
    })),
    on(BoardActions.loadAllBoardsSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        boards: action.boards
    })),
    on(BoardActions.loadAllBoardsFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),

    // Load Board By Id
    on(BoardActions.loadBoardById, (state) => ({
        ...state,
        isLoading: true
    })),
    on(BoardActions.loadBoardByIdSuccess, (state, { board }) => ({
        ...state,
        currentBoard: board,
        isLoading: false
    })),
    on(BoardActions.loadBoardByIdFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),

    // Create Board
    on(BoardActions.createBoard, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(BoardActions.createBoardSuccess, (state, { board }) => ({
        ...state,
        isLoading: false,
        boards: [...state.boards, board]
    })),
    on(BoardActions.createBoardFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),

    // Edit Board
    on(BoardActions.editBoard, (state) => ({
        ...state,
        isLoading: true,
    })),
    on(BoardActions.editBoardSuccess, (state, { board }) => ({
        ...state,
        isLoading: false,
        boards: state.boards.map(b => b.boardId === board.boardId ? { ...b, ...board } : b),
        currentBoard: board
    })),
    on(BoardActions.editBoardFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
    })),

    // Delete Board
    on(BoardActions.deleteBoard, (state) => ({
        ...state,
        isLoading: true,
    })),
    on(BoardActions.deleteBoardSuccess, (state, { boardId }) => ({
        ...state,
        isLoading: false,
        boards: state.boards.filter(board => board.boardId !== boardId),
        currentBoard: state.currentBoard?.boardId === boardId ? null : state.currentBoard,
    })),
    on(BoardActions.deleteBoardFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
    }))
);