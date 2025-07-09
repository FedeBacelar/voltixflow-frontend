import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalContainerComponent} from "../../../../shared/components/modal-container/modal-container.component";
import {NgForOf, NgIf} from "@angular/common";
import {ICreateUser, IRole} from "../../../../shared/models/user.model";
import {UserApiService} from "../../../../core/services/user-api.service";

@Component({
  selector: 'app-user-create-modal',
  standalone: true,
    imports: [
        FormsModule,
        ModalContainerComponent,
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './user-create-modal.component.html',
  styleUrl: './user-create-modal.component.scss'
})
export class UserCreateModalComponent implements OnInit{
  @Output() close:EventEmitter<void> = new EventEmitter<void>();
  @Output() userCreated:EventEmitter<void> = new EventEmitter<void>();

  userRoles:IRole[] = [//todo make request
    {id: 1, name:'Administrador'},
    {id: 2, name:'Supervisor'},
    {id: 3, name:'Deposito'},
    {id: 4, name:'Vendedor'},
    {id: 5, name:'Asistente'}
  ]
  form!: FormGroup;

  showPassword: boolean = false;

  constructor(private fb:FormBuilder, private userApiService:UserApiService) {
    this.userApiService.getAllRoles().subscribe((userRoles:IRole[]) => {
      if(userRoles.length > 0) this.userRoles = userRoles;
    })
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', Validators.required],
      status: [true],
    });
  }

  submitForm(): void {
    if (this.form.invalid) return;

    const userData: ICreateUser = this.form.value;

    this.userApiService.createUser(userData).subscribe({
      next: () => {
        this.userCreated.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al crear usuario', err);
      }
    });
  }

  public closeModal(){
    this.close.emit()
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
