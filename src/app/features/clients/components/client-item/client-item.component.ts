import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IClient} from "../../../../shared/models/client.model";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-client-item',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './client-item.component.html',
  styleUrl: './client-item.component.scss'
})
export class ClientItemComponent {

  @Input() client!:IClient
  @Output() edit:EventEmitter<IClient> = new EventEmitter<IClient>()

  constructor() {
  }

}
