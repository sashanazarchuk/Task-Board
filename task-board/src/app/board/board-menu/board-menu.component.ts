import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-board-menu',
  imports: [MatButtonModule, MatMenuModule],
  templateUrl: './board-menu.component.html',
  styleUrl: './board-menu.component.css'
})

export class BoardMenuComponent {

  //Board name to edit
  @Input() boardName: string = '';

  //Events to create edit and delete a board
  @Output() createBoard = new EventEmitter<void>();

  @Output() editBoard = new EventEmitter<string>();
  
  @Output() deleteBoard = new EventEmitter<void>();


  //Trigger create board event
  onCreateClick() {
    this.createBoard.emit();
  }

  //Trigger edit board event with board name
  onEditClick() {
    this.editBoard.emit(this.boardName);
  }

  //Trigger delete board event
  onDeleteClick() {
    this.deleteBoard.emit();
  }
}
