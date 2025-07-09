import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IRole, IUpdateUser, IUser} from "../../../../shared/models/user.model";
import {UserApiService} from "../../../../core/services/user-api.service";
import {ConfirmDialogComponent} from "../../../../shared/components/confirm-dialog/confirm-dialog.component";
import {ModalContainerComponent} from "../../../../shared/components/modal-container/modal-container.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-user-edit-modal',
  standalone: true,
  imports: [
    ConfirmDialogComponent,
    ModalContainerComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './user-edit-modal.component.html',
  styleUrl: './user-edit-modal.component.scss'
})
export class UserEditModalComponent implements OnChanges{

  @Output() close:EventEmitter<void> = new EventEmitter<void>();
  @Output() userEdited:EventEmitter<void> = new EventEmitter<void>();

  @Input() user!:IUser

  userRoles:IRole[] = [//todo make request
    {id: 1, name:'Administrador'},
    {id: 2, name:'Supervisor'},
    {id: 3, name:'Deposito'},
    {id: 4, name:'Vendedor'},
    {id: 5, name:'Asistente'}
  ]
  form: FormGroup;

  openDeleteDialog:boolean = false;
  showPassword: boolean = false;

  constructor(private fb:FormBuilder, private userApiService:UserApiService) {
    this.userApiService.getAllRoles().subscribe((userRoles:IRole[]) => {
      if(userRoles.length > 0) this.userRoles = userRoles;
    })
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', Validators.required],
      status: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.form.patchValue({
        name: this.user.username,
        username: this.user.username,
        password: this.user.password,
        roleId: this.user.role.id,
        status: this.user.active,
      });
    }
  }

  submitForm(): void {
    if (this.form.invalid) return;
    const userData: IUpdateUser = this.form.value;
    this.userApiService.updateUser(this.user.id, userData).subscribe({
      next: () => {
        this.userEdited.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al modificar usuario', err);
      }
    });
  }

  deleteUser(){
    this.userApiService.deleteUser(this.user.id).subscribe({
      next: () => {
        this.userEdited.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al eliminar usuario', err);
      }
    })
  }

  public closeModal(){
    this.close.emit()
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
