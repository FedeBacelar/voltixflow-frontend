import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, take, shareReplay, map} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {IClient, IClientType, ICreateClient, IGetAllClientQuery, IUpdateClient} from '../../shared/models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientApiService {
  private baseUrl = `${environment.apiBaseUrl}/Client`;

  private clientTypes$: Observable<IClientType[]> | null = null;

  constructor(private http: HttpClient) {}

  private handleError(op: string) {
    return (error: HttpErrorResponse) => {
      console.error(`[ClientApiService] ${op} failed:`, error);
      return throwError(() => new Error(`Error en ${op}: ${error.message}`));
    };
  }

  /**
   * Obtiene la lista de clientes (filtros + paginación en query).
   */
  public getAllClients(query: IGetAllClientQuery): Observable<IClient[]> {
    const params = new HttpParams({
      fromObject: {
        pageNumber: query.pageNumber.toString(),
        pageSize:   query.pageSize.toString(),
        ...(query.name  && { name:  query.name  }),
        ...(query.cuit  && { cuit:  query.cuit  }),
        ...(query.email && { email: query.email })
      }
    });

    return this.http.get<IClient[]>(this.baseUrl, { params })
      .pipe(
        take(1),
        shareReplay(1),
        catchError(this.handleError('getAllClients'))
      );
  }

  /**
   * Busca un cliente por su id
   */
  public getClientById(clientId: number): Observable<IClient> {
    return this.http.get<IClient>(`${this.baseUrl}/${clientId}`)
      .pipe(
        take(1),
        catchError(this.handleError('getClientById'))
      );
  }

  /**
   * Busca un cliente por su id
   */
  public createClient(client: ICreateClient): Observable<IClient> {
    return this.http.post<IClient>(`${this.baseUrl}`, client)
      .pipe(
        take(1),
        catchError(this.handleError('getClientById'))
      );
  }

  /**
   * Actualiza un cliente existente
   */
  public updateClient(clientId:number,client: IUpdateClient): Observable<IClient> {
    return this.http.put<IClient>(`${this.baseUrl}/${clientId}`, client)
      .pipe(
        take(1),
        catchError(this.handleError('getClientById'))
      );
  }

  /**
   * Borra un cliente existente
   */
  public deleteClient(clientId: number): Observable<boolean> {
    return this.http.delete<IClient>(`${this.baseUrl}/${clientId}`)
      .pipe(
        take(1),
        map(() => true),
        catchError(error => {
          this.handleError('deleteClient')(error);
          return of(false);
        })
      );
  }

  /**
   * Obtiene la lista de todos las tipos de clientes
   */
  public getAllClientTypes(): Observable<IClientType[]> {
    if (!this.clientTypes$) {
      this.clientTypes$ = this.http
        .get<IClientType[]>(`${this.baseUrl}/types`)
        .pipe(
          take(1),
          shareReplay({ bufferSize: 1, refCount: false }),
          catchError(this.handleError('getAllClientTypes'))
        );
    }
    return this.clientTypes$;
  }

}
