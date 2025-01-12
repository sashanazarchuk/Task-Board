import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';
import { HistoryService } from '../services/history.service';
import { IHistory } from '../models/history';
import { IBoard } from '../../board/models/board';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-history',
  imports: [MatSidenavModule, MatButtonModule, FormsModule, MatRadioModule, MatIcon, ReactiveFormsModule, NgFor, DatePipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav; //Decorator to access the MatSidenav element in the template

  @Input() board: IBoard | null = null; //Input parameter to get data about the board (board) from the parent component

  histories: IHistory[] = []; //Array for storing history (histories).
  displayedHistories: any[] = []; //The array that will be displayed on the page
  itemsPerPage: number = 6; //Number of entries on one page
  currentPage: number = 0; // Current page (starting from 0)


  constructor(private service: HistoryService) {
    this.loadMoreHistories();
  }

  // Loads additional history entries based on the current page and the number of items per page.
  loadMoreHistories(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedHistories = [
      ...this.displayedHistories,
      ...this.histories.slice(startIndex, endIndex)
    ];
  }


  // Load the next 6 records
  showMore(): void {
    this.currentPage++;
    this.loadMoreHistories();
  }


  // Handles changes to the 'board' property
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['board'] && this.board) {

      // Clear the displayed stories when changing the board
      this.displayedHistories = [];
      this.currentPage = 0; // Starting from first page

      // Load history for new board
      this.loadHistory(this.board.boardId);
    }
  }

  //Load History for current board
  loadHistory(boardId: number): void {
    this.service.getHistory(boardId).subscribe(
      (history) => {
        // Filter stories only for the current board
        this.histories = history.filter(item => item.boardId === boardId);
        console.log('Histories for current board:', this.histories);

        // Load first 6 records after filtering
        this.loadMoreHistories();
      },
      (error) => {
        console.error('Error loading histories:', error);
      }
    );
  }

  //Method for opening sidebar
  openSidenav(): void {
    console.log("Nav open");
    this.sidenav.open();
  }


  //Method for close  sidebar
  closeSidenav(): void {
    console.log("Nav closed");

    // Reload stories for the current board
    if (this.board) {
      this.displayedHistories = [];
      this.currentPage = 0;
      this.loadHistory(this.board.boardId);
    }

    this.sidenav.close();
  }




}
