import { NgFor, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ListComponent } from '../../list/component/list.component';
import { IBoard } from '../models/board';
import { BoardService } from '../services/board.service';
import { HistoryComponent } from '../../history/components/history.component';
import { FormsModule } from '@angular/forms';
import { BoardMenuComponent } from "../board-menu/board-menu.component";


@Component({
  selector: 'app-board',
  imports: [NgIf, NgFor, ListComponent, HistoryComponent, FormsModule, BoardMenuComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})

export class BoardComponent {
  board: IBoard | null = null;
  boards: IBoard[] = [];
  currentBoardId: number = 1;
  isHistoryOpen = false;
  inputBoardValue = ''
  isInputBlockVisible: boolean = false;
  isEditMode: boolean = false;

  @ViewChild('history') historyComponent!: HistoryComponent;

  constructor(private boardService: BoardService) { }

  //Initializes the Id of the current board and loads all boards
  //If no value is found, sets the default Id (1)
  ngOnInit() {
    const savedBoardId = localStorage.getItem('currentBoardId');
    this.currentBoardId = savedBoardId ? parseInt(savedBoardId, 10) : 1;
    this.loadAllBoards();
  }


  //Load all boards
  loadAllBoards(): void {
    this.boardService.getAllBoards().subscribe(data => {
      this.boards = data;
      this.loadBoardById(this.currentBoardId);
    });
  }

  //Load board by Id
  loadBoardById(boardId: number): void {
    this.boardService.getBoardById(boardId).subscribe(data => {
      this.board = data;
      localStorage.setItem('currentBoardId', boardId.toString());

    });

  }
  // Update the current board Id and load a new one
  onBoardChange(boardId: number): void {
    this.currentBoardId = boardId;
    this.loadBoardById(boardId);
  }

  // Toggles the state of the history sidebar (open/closed).
  toggleHistory(): void {
    if (this.historyComponent.sidenav.opened) {
      this.historyComponent.closeSidenav();
    } else {
      this.historyComponent.openSidenav();
    }
  }

  //Close sidebar
  closeHistory() {
    this.isHistoryOpen = false;
  }

  //Create board method
  onCreateBoardClick(): void {
    if (!this.inputBoardValue.trim()) {
      console.error('Board name is empty');
      return;
    }

    const newBoard: IBoard = {
      boardId: 0,
      name: this.inputBoardValue.trim(),
      listDtos: []
    };

    this.boardService.createBoard(newBoard).subscribe(
      (response) => {
        this.inputBoardValue = '';
        this.isInputBlockVisible = false;
        console.log('Board created:', response);
      },
      (error) => {
        console.error('Error creating board:', error);
      }
    );
  }

  //Delete board method
  onDeleteBoardClick(board: IBoard) {
    if (board.boardId !== undefined) {
      this.boardService.deleteBoard(board.boardId).subscribe(
        (response) => {
          console.log('Board deleted:', response);
          this.loadBoardById(1);
          this.currentBoardId = 1;
          localStorage.setItem('currentBoardId', '1');
          location.reload();

        },
        (error) => {
          console.error('Error deleting board:', error);
        }
      );
    } else {
      console.error('Invalid board ID');
    }
  }



  //Method to activate board creation mode
  onCreateMode(): void {
    this.isEditMode = false;
    this.inputBoardValue = '';
    this.isInputBlockVisible = true;
  }

  //Method to activate board editing mode
  onEditMode(board: IBoard): void {
    this.isEditMode = true;
    this.board = board;
    this.inputBoardValue = board.name;
    this.isInputBlockVisible = true;

  }


  //Method to edit the board name: Checks the value entered.
  //Edit the board name on the server, and reloads the page.
  onEditBoardClick() {

    if (this.inputBoardValue && this.board) {
      this.board.name = this.inputBoardValue;
      console.log('List name updated:', this.board);

      this.boardService.editBoardName(this.board).subscribe(
        (response) => {
          console.log('Server updated board:', response);
          this.board = response;
          location.reload();
        },

        (error) => {
          console.error('Error updating board name:', error);
          if (this.board) {
            this.inputBoardValue = this.board.name;
          }
        }
      );
    } else {
      console.error('No input value or selected board found');
    }
  }



  //Method to undo board editing:
  onCancelBoardClick(): void {
    this.isInputBlockVisible = false;
    this.inputBoardValue = '';
  }

  //Input block visibility switch
  toggleInputBlock(): void {
    this.isInputBlockVisible = !this.isInputBlockVisible;
  }

}