import { IBoard } from "./board";

export interface boardState {
    isLoading: boolean;
    boards: IBoard[];
    currentBoard: IBoard | null;
    error: string | null;
}