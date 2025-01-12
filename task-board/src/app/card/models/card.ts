export interface ICard {
    cardId: number,
    name: string,
    description: string,
    date: Date,
    priority: CardPriority,
    cardListId: number,
    
}



export enum CardPriority {

    Low = 1,
    Medium = 2,
    High = 3
}