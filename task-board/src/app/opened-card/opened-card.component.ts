import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogModule, MatDialogTitle, } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CardPriority, ICard } from '../card/models/card';
import { DatePipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService } from '../card/services/card.service';
import { ICardList } from '../list/models/list';
import { IActivity } from '../card/models/activity';
import { AddEditCardComponent } from '../core/components/add-edit-card/add-edit-card.component';

@Component({
  selector: 'app-opened-card',
  imports: [MatDialogContent, MatDialogTitle, MatIcon, MatDialogModule, MatButtonModule, DatePipe, FormsModule, NgFor],
  templateUrl: './opened-card.component.html',
  styleUrl: './opened-card.component.css'
})


export class OpenedCardComponent {

  card: ICard;
  cardLists: ICardList[] = [];
  activities: IActivity[] = [];
  readonly dialog = inject(MatDialog);


  //Initializes card data, card lists, and activities from dialog data
  constructor(@Inject(MAT_DIALOG_DATA) public data: { card: ICard, cardLists: ICardList[], activity: IActivity[] }, public service: CardService) {
    this.card = data.card;
    this.cardLists = data.cardLists;
    this.activities = data.activity
  }

  // Initializes the component, loads the activity for the card if it has a cardId
  ngOnInit(): void {
    if (this.card.cardId) {
      this.loadActivities(this.card.cardId);
    }

  }

  // Returns the text value of the card's priority
  getPriorityName(priority: CardPriority): string {
    switch (priority) {
      case CardPriority.Low:
        return 'Low';
      case CardPriority.Medium:
        return 'Medium';
      case CardPriority.High:
        return 'High';
      default:
        return 'Unknown';
    }
  }


  // Move card into another list if it exists and reloads the page after a successful update
  moveCard(card: ICard): void {
    if (card) {
      this.service.updateCard(card).subscribe(
        (response) => {
          location.reload();
          console.log('Card successfully moved', response);
        },
        (error) => {
          console.error('Error moving card', error);
        }
      );
    }
  }


  // Loads activities for a card by its id
  loadActivities(cardId: number): void {
    this.service.getActivities(cardId).subscribe(
      (activities) => {
        this.activities = activities;
        console.log('Activities:', this.activities);
      },
      (error) => {
        console.error('Error loading activities:', error);
      }
    );
  }


  // Opens a modal dialog for editing the card with the relevant data
  openEditCardDialog(card: ICard) {
    const dialogRef = this.dialog.open(AddEditCardComponent, {
      width: '35vw',
      maxWidth: '100vw',
      height: '74vh',
      disableClose: true,
      data: {
        card: card,
        cardLists: this.cardLists,
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Create Dialog closed');
    });
  }
}