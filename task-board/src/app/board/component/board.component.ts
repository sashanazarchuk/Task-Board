import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ListComponent } from '../../list/component/list.component';
import { IBoard } from '../models/board';
import { BoardService } from '../services/board.service';
import { HistoryComponent } from '../../history/components/history.component';
import { FormsModule } from '@angular/forms';
import { BoardMenuComponent } from "../board-menu/board-menu.component";
import { select, Store } from '@ngrx/store';
import * as BoardActions from '../store/actions'
import { boardSelector, getBoardByIdSelector, isLoadingSelector } from '../store/selectors';
import { Observable, of } from 'rxjs';
import { AppState } from '../../types/appState';

@Component({
  selector: 'app-board',
  imports: [NgIf, NgFor, ListComponent, HistoryComponent, FormsModule, BoardMenuComponent, AsyncPipe],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})

export class BoardComponent implements OnInit {

  isHistoryOpen = false;
  inputBoardValue = ''
  isInputBlockVisible: boolean = false;
  isEditMode: boolean = false;

  currentBoardId: number = 1;
  isLoading$: Observable<boolean>;
  boards$: Observable<IBoard[]>;
  currentBoard$: Observable<IBoard | null>;
  @ViewChild('history') historyComponent!: HistoryComponent;

  constructor(private store: Store<AppState>) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.boards$ = this.store.pipe(select(boardSelector));
    this.currentBoard$ = this.store.pipe(select(getBoardByIdSelector));
  }

  //Initializes the Id of the current board and loads all boards
  //If no value is found, sets the default Id (1)
  ngOnInit() {
    const savedBoardId = localStorage.getItem('currentBoardId');
    this.currentBoardId = savedBoardId ? parseInt(savedBoardId, 10) : 1;
    this.store.dispatch(BoardActions.loadAllBoards());
    this.store.dispatch(BoardActions.loadBoardById({ boardId: this.currentBoardId }));
  }

  // Update the current board Id and load a new one
  onBoardChange(boardId: number): void {
    console.log('Changing board to:', boardId);
    this.currentBoardId = boardId;
    localStorage.setItem('currentBoardId', this.currentBoardId.toString());
    this.store.dispatch(BoardActions.loadBoardById({ boardId: this.currentBoardId }));
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

    this.store.dispatch(BoardActions.createBoard({ board: newBoard }));

    this.inputBoardValue = '';
    this.isInputBlockVisible = false;
  }

  //Delete board method
  onDeleteBoardClick(board: IBoard) {
    if (board.boardId !== undefined) {
      this.store.dispatch(BoardActions.deleteBoard({ boardId: board.boardId }));
      this.store.dispatch(BoardActions.loadBoardById({ boardId: 1 }));
      this.currentBoardId = 1;
      localStorage.setItem('currentBoardId', '1');
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
    this.currentBoard$ = of(board);
    this.inputBoardValue = board.name;
    this.isInputBlockVisible = true;
  }


  //Method to edit the board name
  onEditBoardClick(currentBoard: IBoard) {
    if (currentBoard && this.inputBoardValue.trim()) {
      console.log('Dispatching editBoard action with:', currentBoard);
      this.store.dispatch(BoardActions.editBoard({ board: { ...currentBoard, name: this.inputBoardValue } }));
      this.inputBoardValue = '';
      this.isInputBlockVisible = false;
    } else {
      console.error('Input value is empty or invalid');
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