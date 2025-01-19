import { Component, inject, Input } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { CardPriority, ICard } from '../models/card';
import { ICardList } from '../../list/models/list';
import { CardService } from '../services/card.service';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OpenedCardComponent } from '../../opened-card/opened-card.component';
import { MenuComponent } from '../../core/components/menu/menu.component';
import { IActivity } from '../models/activity';
import { AddEditCardComponent } from '../../core/components/add-edit-card/add-edit-card.component';

@Component({
  selector: 'app-card',
  imports: [NgIf, NgFor, DatePipe, FormsModule, MatDialogModule, MenuComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})

export class CardComponent {
  @Input() listDtos: ICard[] = [];
  @Input() cardLists: ICardList[] = [];
  @Input() card: ICard | null = null;
  @Input() activities: IActivity[] = [];
  readonly dialog = inject(MatDialog);

  constructor(private service: CardService) { }



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


  //Method for moving card into another list
  moveCard(card: ICard): void {
    if (card) {
      this.service.updateCard(card).subscribe(
        (response) => {
          // location.reload();
          console.log('Card successfully moved', response);
        },
        (error) => {
          console.error('Error moving card', error);
        }
      );
    }
  }

  // Method to open a modal dialog with a card data
  openCardDialog(card: ICard) {
    const dialogRef = this.dialog.open(OpenedCardComponent, {
      width: '80vw',
      maxWidth: '100vw',
      height: '74vh',
      disableClose: true,
      data: {
        card: card,
        cardLists: this.cardLists,
        activity: this.activities
      }
    });

    dialogRef.afterOpened().subscribe(() => {
      console.log(`There is ${card.name}`)
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Dialog closed');
    });
  }

  //Method to open modal dialog for editing card
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
      console.log('Dialog closed');
    });
  }


  // Method to remove the card
  onDeleteClick(card: ICard) {
    if (card.cardId !== undefined) {
      this.service.deleteCard(card.cardId).subscribe(
        (response) => {
          console.log('Card deleted:', response);
          location.reload();
        },
        (error) => {
          console.error('Error deleting card:', error);
        }
      );
    } else {
      console.error('Invalid card ID');
    }

  }


}