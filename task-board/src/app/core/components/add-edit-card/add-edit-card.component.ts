import { DatePipe, NgFor } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ICardList } from '../../../list/models/list';
import { CardService } from '../../../card/services/card.service';
import { IBoard } from '../../../board/models/board';
import { CardPriority, ICard } from '../../../card/models/card';

@Component({
  selector: 'app-add-edit-card',
  imports: [MatDialogTitle, MatIcon, MatDialogModule, FormsModule, MatButtonModule, NgFor, DatePipe],
  templateUrl: './add-edit-card.component.html',
  styleUrl: './add-edit-card.component.css'
})
export class AddEditCardComponent {

  @Input() board: IBoard | null = null;
  CardPriority = CardPriority;
  inputNameCard: string = '';
  inputDescCard: string = '';
  selectedPriority: CardPriority | null = null;
  selectedCardListId: number | null = null;

  cardLists: ICardList[] = [];

  selectedDate: Date | null = null;
  availableDates: Date[] = [];

  card: ICard;


  // The constructor initializes the component with the card and cardlist data obtained via MAT_DIALOG_DATA.
  // Sets values ​​for card, description, priority, card list, and date, or defaults.
  constructor(@Inject(MAT_DIALOG_DATA) public data: { card: ICard, cardLists: ICardList[] }, private service: CardService, public dialogRef: MatDialogRef<AddEditCardComponent>) {

    this.card = data.card || { cardId: 0, name: '', description: '', date: null, priority: null, cardListId: null };

    this.inputNameCard = this.card.name || '';
    this.inputDescCard = this.card.description || '';
    this.selectedPriority = this.card.priority || null;
    this.selectedCardListId = this.card.cardListId || null;
    this.selectedDate = this.card.date ? new Date(this.card.date) : null;

    this.cardLists = data.cardLists;
  }


  //Close modal dialog
  closeModal(): void {
    this.dialogRef.close();
  }


  ngOnInit() {

    this.generateDates(7);

    // If the current date is not included in the available list, we add it
    if (this.selectedDate && !this.availableDates.some(date => this.isSameDate(date, this.selectedDate!))) {
      this.availableDates.unshift(new Date(this.selectedDate)); // Add a copy of the date
    }

    // Check whether the selected date matches the date from the list
    const matchingDate = this.availableDates.find(date => this.isSameDate(date, this.selectedDate!));
    if (matchingDate) {
      this.selectedDate = matchingDate; // Bind date object with a list
    }
  }


  //Compares two dates
  isSameDate(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  //Generates an array of dates starting from today, adding the given number of days
  generateDates(days: number) {
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      this.availableDates.push(date);
    }
  }

  //Validates the selected date and outputs it in ISO 8601 format, or reports an error.
  onDateChange() {
    if (this.selectedDate instanceof Date && !isNaN(this.selectedDate.getTime())) {
      const isoDateString = this.selectedDate.toISOString(); // Convert to ISO 8601 format
      console.log('Selected Date (ISO 8601):', isoDateString);
    } else {
      console.error('Selected date is invalid');
    }
  }

  //Method creating card
  createCard(): void {
    if (!this.inputNameCard || !this.selectedDate || !this.selectedPriority || !this.selectedCardListId) {
      alert('Fill in all required fields!');
      return;
    }

    // Create a new card
    const newCard: ICard = {
      cardId: 0,
      name: this.inputNameCard,
      description: this.inputDescCard,
      date: this.selectedDate,
      priority: this.selectedPriority,
      cardListId: this.selectedCardListId
    };

    console.log('New Card:', newCard); // Check the value before sending

    this.service.createCard(newCard).subscribe({
      next: () => {
        this.closeModal();
        location.reload();
      },
      error: (error) => {
        console.error('Error creating card:', error);
        alert('Failed to create card.');
      },
    });
  }


  //Method editing card 
  editCard(): void {
    if (!this.inputNameCard || !this.selectedDate || !this.selectedPriority || !this.selectedCardListId) {
      alert('Fill in all required fields!');
      return;
    }
    const isDateChanged = this.card.date ? !this.isSameDate(this.selectedDate, new Date(this.card.date)) : false;

    const updatedCard: ICard = {
      cardId: this.card.cardId,
      name: this.inputNameCard,
      description: this.inputDescCard,
      date: isDateChanged ? this.selectedDate : this.card.date,
      priority: this.selectedPriority,
      cardListId: this.selectedCardListId,
    };

    this.service.updateCard(updatedCard).subscribe({
      next: () => {
        this.closeModal();
        location.reload();
      },
      error: (error) => {
        console.error('Error editing card:', error);
        alert('Failed editing card.');
      },
    });
  }
}