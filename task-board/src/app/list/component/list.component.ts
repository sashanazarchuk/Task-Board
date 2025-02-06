import { Component, inject, Input } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ICard } from '../../card/models/card';
import { CardComponent } from "../../card/component/card.component";
import { IBoard } from '../../board/models/board';
import { ICardList } from '../models/list';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MenuComponent } from '../../core/components/menu/menu.component';
import { AddEditCardComponent } from '../../core/components/add-edit-card/add-edit-card.component';
import { AppState } from '../../types/appState';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as ListActions from '../store/list-actions'
import { listIsLoadingSelector, listSelector, selectorCurrentList } from '../store/list-selector';


@Component({
  selector: 'app-list',
  imports: [NgFor, NgIf, CardComponent, FormsModule, MenuComponent, AsyncPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})


export class ListComponent {

  showMenuInput: boolean = false;
  isInputBlockVisible: boolean = false;
  inputMenuValue: string = '';
  inputListValue: string = '';

  readonly dialog = inject(MatDialog);

  @Input() board$!: Observable<IBoard | null>;

  lists$: Observable<ICardList[]>;
  currentList$: Observable<ICardList | null>;
  isLoading$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.lists$ = this.store.pipe(select(listSelector));
    this.currentList$ = this.store.pipe(select(selectorCurrentList));
    this.isLoading$ = this.store.pipe(select(listIsLoadingSelector))
  }

  ngOnInit(): void {
    this.board$.subscribe(board => {
      if (board) {
        this.store.dispatch(ListActions.loadListsByBoardId({ boardId: board.boardId }));
      }
    });
  }

  // Open a modal dialog for creating or editing a card
  openAddCardDialog(board: IBoard): void {
    if (!board) {
      return;
    }

    const dialogRef = this.dialog.open(AddEditCardComponent, {
      width: '35vw',
      maxWidth: '100vw',
      height: '74vh',
      disableClose: true,
      data: {
        cardLists: board.listDtos,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Create Dialog closed');
    });
  }



  // Returns the card list for the specified card list
  getCardsFromList(cardListId: number, board: IBoard | null): ICard[] {
    if (!board) {
      return [];
    }

    const list = board.listDtos?.find(list => list.cardListId === cardListId);
    return list?.cards || [];
  }

  // Sets the selected card list to edit
  onEditListClick(cardList: ICardList): void {
    this.currentList$ = of(cardList);
    this.inputMenuValue = cardList.name;
    this.showMenuInput = true;
  }

  // Checks for a value in input and selects a card list
  onAddMenuClick(currentList: ICardList) {

    if (currentList && this.inputMenuValue.trim()) {
      this.store.dispatch(ListActions.editList({
        list: { ...currentList, name: this.inputMenuValue }
      }));
      this.inputMenuValue = '';
      this.showMenuInput = false;
    } else {
      console.error('Input value is empty or invalid');
    }
  }



  // Cancel and hide menu
  onCancelMenuClick() {
    this.showMenuInput = false;
  }


  // Creates a new card list
  onCreateListClick(board: IBoard | null): void {
    if (!board || !this.inputListValue.trim()) {
      console.error('Board is not selected or list name is empty');
      return;
    }

    const newList: ICardList = {
      cardListId: 0,
      name: this.inputListValue.trim(),
      cards: [],
      cardCount: 0,
      boardId: board.boardId
    };

    // Call the create method on the server
    this.store.dispatch(ListActions.createList({ list: newList }));
    this.inputListValue = '';
    this.isInputBlockVisible = false;
  }

  //Method deleting card list
  onDeleteListClick(cardList: ICardList) {
    if (cardList.cardListId !== undefined) {

      // Call the delete method on the server
      this.store.dispatch(ListActions.deleteList({ listId: cardList.cardListId }));

    } else {
      console.error('Invalid card list ID');
    }

  }


  // Toggles the visibility of the input block
  toggleInputBlock(): void {
    this.isInputBlockVisible = !this.isInputBlockVisible;
  }

  // Hides the input block on cancel
  onCancelListClick(): void {
    this.isInputBlockVisible = false;
  }

}