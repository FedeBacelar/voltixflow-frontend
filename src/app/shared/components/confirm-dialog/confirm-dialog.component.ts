import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalContainerComponent} from "../modal-container/modal-container.component";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    ModalContainerComponent
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  @Input() message:string = '';
  @Output() confirm:EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel:EventEmitter<void> = new EventEmitter<void>();

  closeDialog(){
    this.cancel.emit()
  }

  confirmDialog(){
    this.confirm.emit()
  }

}
