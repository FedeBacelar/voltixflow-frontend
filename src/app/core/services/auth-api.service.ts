import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ILoginRequest, ILoginResponse } from '../../shared/models/auth.model';
import {environment} from "../../../environments/environment";
import {catchError, Observable, throwError} from "rxjs";
import {take} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private baseUrl = `${environment.apiBaseUrl}/Auth`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('[AuthApiService] Login failed:', error);
    const message = error.status === 401
      ? 'Credenciales inválidas.'
      : 'Ocurrió un error inesperado.';

    return throwError(() => new Error(message));
  }

  /**
   * Realiza login con email y password. Retorna un token + usuario.
   */
  public login(body: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.baseUrl}/login`, body)
      .pipe(
        take(1),
        catchError(this.handleError)
      );
  }
}
