import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IUser} from "../../../../shared/models/user.model";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-user-item',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss'
})
export class UserItemComponent {
  @Input() user!:IUser
  @Output() edit:EventEmitter<IUser> = new EventEmitter<IUser>()

  constructor() {
  }
}
