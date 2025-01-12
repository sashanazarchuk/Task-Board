import { Component, inject, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ICard } from '../../card/models/card';
import { CardComponent } from "../../card/component/card.component";
import { IBoard } from '../../board/models/board';
import { ICardList } from '../models/list';
import { ListService } from '../services/list.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MenuComponent } from '../../core/components/menu/menu.component';
import { AddEditCardComponent } from '../../core/components/add-edit-card/add-edit-card.component';

@Component({
  selector: 'app-list',
  imports: [NgFor, NgIf, CardComponent, FormsModule, MenuComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  @Input() board: IBoard | null = null;
  @Input() listDtos: ICard[] = [];

  list: ICardList[] = [];
  selectedCardList: ICardList | null = null;
  showMenuInput: boolean = false;
  inputMenuValue: string = '';
  inputListValue: string = '';
  isInputBlockVisible: boolean = false;

  readonly dialog = inject(MatDialog);

  constructor(private service: ListService) { }


  // Open a modal dialog for creating or editing a card
  openAddCardDialog() {
    const dialogRef = this.dialog.open(AddEditCardComponent, {
      width: '35vw',
      maxWidth: '100vw',
      height: '74vh',
      disableClose: true,
      data: {
        cardLists: this.board?.listDtos,
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Create Dialog closed');
    });
  }



  // Returns the card list for the specified card list
  getCardsFromList(cardListId: number): ICard[] {
    return this.board?.listDtos
      ?.find(list => list.cardListId === cardListId)
      ?.cards || [];

  }


  // Sets the selected card list to edit
  onEditListClick(cardList: ICardList) {
    this.selectedCardList = cardList;  // Select the list for editing
    this.inputMenuValue = cardList.name;  // Set the input value to the current name
    this.showMenuInput = true;  // Show input and buttons
  }


  // Checks for a value in input and selects a card list
  onAddMenuClick() {
    // Check if there is a value in inputMenuValue and if card list is selected
    if (this.inputMenuValue && this.selectedCardList) {
      this.selectedCardList.name = this.inputMenuValue;
      console.log('List name updated:', this.selectedCardList);

      // Call the editing method on the server
      this.service.editListName(this.selectedCardList).subscribe(
        (updatedCardList) => {

          console.log('Server updated list:', updatedCardList);
          this.selectedCardList = updatedCardList;
        },
        (error) => {
          console.error('Error updating list name:', error);
          if (this.selectedCardList) {
            this.inputMenuValue = this.selectedCardList.name;
          }
        }
      );
    } else {
      console.error('No input value or selected card list found');
    }

    // Hide input and buttons after editing
    this.showMenuInput = false;
  }



  // Cancel and hide menu
  onCancelMenuClick() {
    this.showMenuInput = false;
  }


  // Creates a new card list
  onCreateListClick(): void {

    if (!this.board || !this.inputListValue.trim()) {
      console.error('Board is not selected or list name is empty');
      return;
    }

    const newList: ICardList = {
      cardListId: 0,
      name: this.inputListValue.trim(),
      cards: [],
      cardCount: 0,
      boardId: this.board.boardId
    };

    // Call the create method on the server
    this.service.createList(newList).subscribe(
      (createdList) => {
        console.log('List created:', createdList);
        if (!createdList || !createdList.cardListId) {
          console.error('Invalid list response:', createdList);
          return;
        }

        // Add a new list to the local model
        this.board?.listDtos?.push(createdList);

        // Clear the input field and hide the block
        this.inputListValue = '';
        this.isInputBlockVisible = false;
      },
      (error) => {
        console.error('Error creating list:', error);
      }
    );
  }

  //Method deleting card list
  onDeleteListClick(cardList: ICardList) {
    if (cardList.cardListId !== undefined) {

      // Call the delete method on the server
      this.service.deleteList(cardList.cardListId).subscribe(
        (response) => {
          console.log('List deleted:', response);
          location.reload();
        },
        (error) => {
          console.error('Error deleting list:', error);
        }
      );
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
