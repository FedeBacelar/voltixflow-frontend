import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILoginRequest, ILoginResponse } from '../../shared/models/auth.model';
import {environment} from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private baseUrl = environment.apiBaseUrl + '/Auth';

  constructor(private http: HttpClient) {}

  login(body: ILoginRequest) {
    return this.http.post<ILoginResponse>(`${this.baseUrl}/login`, body);
  }
}
