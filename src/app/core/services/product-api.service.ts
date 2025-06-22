import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable, of, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, map, shareReplay, take} from "rxjs/operators";
import {
  ICreateProduct,
  IGetAllProductsQuery,
  IProduct,
  IProductCategory,
  IUpdateProduct
} from "../../shared/models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private baseUrl = `${environment.apiBaseUrl}/Product`;

  private productCategories$: Observable<IProductCategory[]> | null = null;

  constructor(private http: HttpClient) {}

  private handleError(op: string) {
    return (error: HttpErrorResponse) => {
      console.error(`[ProductApiService] ${op} failed:`, error);
      return throwError(() => new Error(`Error en ${op}: ${error.message}`));
    };
  }

  /**
   * Obtiene la lista de productos (filtros + paginación en query).
   */
  public getAllProducts(query: IGetAllProductsQuery): Observable<IProduct[]> {
    const params = new HttpParams({
      fromObject: {
        pageNumber: query.pageNumber.toString(),
        pageSize:   query.pageSize.toString(),
        ...(query.name  && { name:  query.name  }),
        ...(query.code  && { cuit:  query.code  })
      }
    });
    return this.http.get<IProduct[]>(this.baseUrl, { params })
      .pipe(
        take(1),
        shareReplay(1),
        catchError(this.handleError('getAllProducts'))
      );
  }

  /**
   * Busca un producto por su id
   */
  public getProductById(productId: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseUrl}/${productId}`)
      .pipe(
        take(1),
        catchError(this.handleError('getProductById'))
      );
  }

  /**
   * Crea un nuevo producto
   */
  public createProduct(product: ICreateProduct): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.baseUrl}`, product)
      .pipe(
        take(1),
        catchError(this.handleError('createProduct'))
      );
  }

  /**
   * Actualiza un producto existente
   */
  public updateProduct(productId:number,product: IUpdateProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.baseUrl}/${productId}`, product)
      .pipe(
        take(1),
        catchError(this.handleError('updateProduct'))
      );
  }

  /**
   * Borra un producto existente
   */
  public deleteProduct(productId: number): Observable<boolean> {
    return this.http.delete<IProduct>(`${this.baseUrl}/${productId}`)
      .pipe(
        take(1),
        map(() => true),
        catchError(error => {
          this.handleError('deleteProduct')(error);
          return of(false);
        })
      );
  }

  /**
   * Obtiene la lista de todas las categorias de productos
   */
  public getAllProductCategories(): Observable<IProductCategory[]> {
    if (!this.productCategories$) {
      this.productCategories$ = this.http
        .get<IProductCategory[]>(`${this.baseUrl}/categories`)
        .pipe(
          take(1),
          shareReplay({ bufferSize: 1, refCount: false }),
          catchError(this.handleError('getAllProductCategories'))
        );
    }
    return this.productCategories$;
  }
}
