import { ICard } from "../../card/models/card";

export interface ICardList {
    
    cardListId: number,
    name: string,
    boardId: number,
    cards: ICard[],
    cardCount: number
}