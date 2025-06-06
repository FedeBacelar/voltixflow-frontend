import { Injectable, signal, computed } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = signal(false);
  private _roles = signal<string[]>([]);
  private _permissions = signal<string[]>([]);
  private _username = signal<string | null>(null);

  readonly isAuthenticated = computed(() => this._isAuthenticated());
  readonly userRoles = computed(() => this._roles());
  readonly userPermissions = computed(() => this._permissions());
  readonly userName = computed(() => this._username());

  constructor(private router:Router) {
    this.autoLogin();
  }

  login(
    token: string,
    role: string,
    permissions: string[],
    expiresAt: string,
    username: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('permissions', JSON.stringify(permissions));
    localStorage.setItem('expiresAt', expiresAt);
    localStorage.setItem('username', username);

    this._isAuthenticated.set(true);
    this._roles.set([role]);
    this._permissions.set(permissions);
    this._username.set(username);
  }

  logout() {
    this.router.navigateByUrl('/login');
    localStorage.clear();
    this._isAuthenticated.set(false);
    this._roles.set([]);
    this._permissions.set([]);
    this._username.set(null);
  }

  autoLogin() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    const username = localStorage.getItem('username');
    const expiresAt = localStorage.getItem('expiresAt');

    if (!token || !role || !expiresAt || !username) {
      return;
    }

    const expired = new Date(expiresAt).getTime() < new Date().getTime();
    if (expired) {
      this.logout();
      return;
    }

    this._isAuthenticated.set(true);
    this._roles.set([role]);
    this._permissions.set(permissions);
    this._username.set(username);
  }

  hasPermission(permission: string): boolean {
    return this._permissions().includes(permission);
  }

  hasRole(role: string): boolean {
    return this._roles().includes(role);
  }
}
