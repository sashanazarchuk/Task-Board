import { boardState } from "../board/models/boardState";
import { listState } from "../list/models/listState";

export interface AppState{
    boards: boardState,
    lists: listState
}