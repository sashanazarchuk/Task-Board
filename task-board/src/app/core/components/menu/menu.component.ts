import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-menu',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  // The name of the list to edit
  @Input() cardListName: string = '';

  //Event for edit and delete list
  @Output() editListName = new EventEmitter<string>();
  
  @Output() deleteList = new EventEmitter<void>();


  //Trigger edit list event with list name
  onEditClick() {
    this.editListName.emit(this.cardListName);
  }
  //Trigger delete list event
  onDeleteClick() {
    this.deleteList.emit();
  }
}
