import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../../core/services/auth-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Permissions } from '../../../../core/constants/permissions';
import { CommonModule } from '@angular/common';

import { interval, Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { version as appVersion } from '../../../../../../package.json';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  loading = false;
  error: string | null = null;

  version = appVersion;
  time$: Observable<Date> = interval(1000).pipe(
    startWith(0),
    map(() => new Date())
  );

  constructor(
    private authApi: AuthApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const { username, password } = this.loginForm.value;
    if (!username || !password) {
      return;
    }

    this.authApi.login({ username, password }).subscribe({
      next: (res) => {
        this.auth.login(res.token, res.role, res.permissions, res.expiresAt, res.username);

        if (this.auth.hasPermission(Permissions.CLIENTS_NAVIGATE)) {
          this.router.navigateByUrl('/clients');
        } else if (this.auth.hasPermission(Permissions.PRODUCTS_NAVIGATE)) {
          this.router.navigateByUrl('/inventory');
        } else if (this.auth.hasPermission(Permissions.DELIVERY_NOTES_NAVIGATE)) {
          this.router.navigateByUrl('/delivery-notes');
        } else if (this.auth.hasPermission(Permissions.USERS_NAVIGATE)) {
          this.router.navigateByUrl('/users');
        } else {
          this.router.navigateByUrl('/unauthorized');
        }
      },
      error: (err) => {
        this.error = 'Usuario o contraseña incorrectos';
        this.loading = false;
      },
    });
  }
}
