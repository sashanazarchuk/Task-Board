import { ICardList } from "../../list/models/list";

export interface IBoard {
    boardId: number,
    name: string,
    listDtos: ICardList[]
}