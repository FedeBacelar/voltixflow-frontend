import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalContainerComponent} from "../../../../shared/components/modal-container/modal-container.component";
import {NgForOf, NgIf} from "@angular/common";
import {IClient, IClientType, IUpdateClient} from "../../../../shared/models/client.model";
import {ClientApiService} from "../../../../core/services/client-api.service";
import {ConfirmDialogComponent} from "../../../../shared/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-client-edit-modal',
  standalone: true,
  imports: [
    FormsModule,
    ModalContainerComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    ConfirmDialogComponent
  ],
  templateUrl: './client-edit-modal.component.html',
  styleUrl: './client-edit-modal.component.scss'
})
export class ClientEditModalComponent implements OnChanges{

  @Output() close:EventEmitter<void> = new EventEmitter<void>();
  @Output() clientEdited:EventEmitter<void> = new EventEmitter<void>();

  @Input() client!:IClient

  clientTypes:IClientType[] = []
  form: FormGroup;

  openDeleteDialog:boolean = false;

  constructor(private fb:FormBuilder, private clientApiService:ClientApiService) {
    this.clientApiService.getAllClientTypes().subscribe((clientTypes:IClientType[]) => {
      if(clientTypes.length > 0) this.clientTypes = clientTypes;
    })
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      clientTypeId: [null, [Validators.required]],
      cuit: ['', [Validators.required, Validators.required]],
      phone: ['', Validators.required],
      contact: [''],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      status: [true],
      observations: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['client'] && this.client) {
      this.form.patchValue({
        name: this.client.name,
        clientTypeId: this.client.clientType.id,
        cuit: this.client.cuit,
        phone: this.client.phone,
        contact: this.client.contact,
        email: this.client.email,
        address: this.client.address,
        status: this.client.status,
        observations: this.client.observations
      });
    }
  }

  submitForm(): void {
    if (this.form.invalid) return;
    const clientData: IUpdateClient = this.form.value;
    this.clientApiService.updateClient(this.client.id, clientData).subscribe({
      next: () => {
        this.clientEdited.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al modificar cliente', err);
      }
    });
  }

  deleteClient(){
    this.clientApiService.deleteClient(this.client.id).subscribe({
      next: () => {
        this.clientEdited.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al eliminar cliente', err);
      }
    })
  }

  public closeModal(){
    this.close.emit()
  }
}
