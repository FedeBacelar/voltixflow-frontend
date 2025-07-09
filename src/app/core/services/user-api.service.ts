import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable, of, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, map, shareReplay, take} from "rxjs/operators";
import {ICreateUser, IGetAllUserQuery, IRole, IUpdateUser, IUser} from "../../shared/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private baseUrl = `${environment.apiBaseUrl}/User`;

  constructor(private http: HttpClient) {}

  private handleError(op: string) {
    return (error: HttpErrorResponse) => {
      console.error(`[UserApiService] ${op} failed:`, error);
      return throwError(() => new Error(`Error en ${op}: ${error.message}`));
    };
  }

  /**
   * Obtiene la lista de usuarios (filtros + paginación en query).
   */
  public getAllUsers(query: IGetAllUserQuery): Observable<IUser[]> {
    const params = new HttpParams({
      fromObject: {
        pageNumber: query.pageNumber.toString(),
        pageSize:   query.pageSize.toString(),
        ...(query.name  && { name:  query.name  }),
        ...(query.roleId  && { roleId:  query.roleId  })
      }
    });

    return this.http.get<IUser[]>(this.baseUrl, { params })
      .pipe(
        take(1),
        shareReplay(1),
        catchError(this.handleError('getAllUsers'))
      );
  }

  /**
   * Busca un usuario por su id
   */
  public getUserById(userId: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/${userId}`)
      .pipe(
        take(1),
        catchError(this.handleError('getUserById'))
      );
  }

  /**
   * Busca un usuario por su id
   */
  public createUser(user: ICreateUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}`, user)
      .pipe(
        take(1),
        catchError(this.handleError('createUser'))
      );
  }

  /**
   * Actualiza un usuario existente
   */
  public updateUser(userId:number, user: IUpdateUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.baseUrl}/${userId}`, user)
      .pipe(
        take(1),
        catchError(this.handleError('updateUser'))
      );
  }

  /**
   * Borra un usuario existente
   */
  public deleteUser(userId: number): Observable<boolean> {
    return this.http.delete<IUser>(`${this.baseUrl}/${userId}`)
      .pipe(
        take(1),
        map(() => true),
        catchError(error => {
          this.handleError('deleteUser')(error);
          return of(false);
        })
      );
  }

  public getAllRoles(): Observable<IRole[]> {
    return this.http.get<IRole[]>(`${this.baseUrl}/roles`)
      .pipe(
        take(1),
        catchError(this.handleError('getAllRoles'))
      );
  }
}
