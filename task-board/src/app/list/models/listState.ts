import { ICardList } from "./list";

export interface listState {
    isLoading: boolean;
    lists: ICardList[];
    currentList: ICardList | null;
    error: string | null;
}