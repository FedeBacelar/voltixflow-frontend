import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import {AuthService} from "../../services/auth.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router:Router = inject(Router);
  const authService:AuthService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigateByUrl('/login');
      } else if (error.status === 403) {
        router.navigateByUrl('/unauthorized');
      }

      return throwError(() => error);
    })
  );
};
