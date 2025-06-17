import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ModalContainerComponent} from "../../../../shared/components/modal-container/modal-container.component";
import {IClientType, ICreateClient} from "../../../../shared/models/client.model";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ClientApiService} from "../../../../core/services/client-api.service";

@Component({
  selector: 'app-client-create-modal',
  standalone: true,
  imports: [
    NgIf,
    ModalContainerComponent,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './client-create-modal.component.html',
  styleUrl: './client-create-modal.component.scss'
})
export class ClientCreateModalComponent implements OnInit{

  @Output() close:EventEmitter<void> = new EventEmitter<void>();
  @Output() clientCreated:EventEmitter<void> = new EventEmitter<void>();

  clientTypes:IClientType[] = []
  form!: FormGroup;

  constructor(private fb:FormBuilder, private clientApiService:ClientApiService) {
    this.clientApiService.getAllClientTypes().subscribe((clientTypes:IClientType[]) => {
      if(clientTypes.length > 0) this.clientTypes = clientTypes;
    })
  }

  ngOnInit(): void {
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

  submitForm(): void {
    if (this.form.invalid) return;

    const clientData: ICreateClient = this.form.value;

    this.clientApiService.createClient(clientData).subscribe({
      next: () => {
        this.clientCreated.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al crear cliente', err);
      }
    });
  }

  public closeModal(){
    this.close.emit()
  }
}
