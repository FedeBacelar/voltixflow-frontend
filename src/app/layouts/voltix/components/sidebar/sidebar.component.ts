import { Component, HostListener } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { Permissions } from '../../../../core/constants/permissions';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  permission: string;
  hotkey: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    HasPermissionDirective,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  protected readonly Permissions = Permissions;

  menu: MenuItem[] = [
    {
      label: 'Clientes',
      icon: 'group',
      route: '/clients',
      permission: Permissions.CLIENTS_NAVIGATE,
      hotkey: 'F1'
    },
    {
      label: 'Stock',
      icon: 'inventory_2',
      route: '/inventory',
      permission: Permissions.PRODUCTS_NAVIGATE,
      hotkey: 'F2'
    },
    {
      label: 'Remitos',
      icon: 'local_shipping',
      route: '/delivery-notes',
      permission: Permissions.DELIVERY_NOTES_NAVIGATE,
      hotkey: 'F3'
    },
    {
      label: 'Usuarios',
      icon: 'people_alt',
      route: '/users',
      permission: Permissions.USERS_NAVIGATE,
      hotkey: 'F4'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get userName(): string | null {
    return this.authService.userName();
  }

  get userRole(): string | null {
    const roles = this.authService.userRoles();
    return roles.length ? roles[0] : null;
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('window:keydown', ['$event'])
  handleFunctionKeys(event: KeyboardEvent) {
    if (event.key === 'F1') {
      event.preventDefault();
      this.goToIfPermitted(Permissions.CLIENTS_NAVIGATE, '/clients');
    } else if (event.key === 'F2') {
      event.preventDefault();
      this.goToIfPermitted(Permissions.PRODUCTS_NAVIGATE, '/inventory');
    } else if (event.key === 'F3') {
      event.preventDefault();
      this.goToIfPermitted(Permissions.DELIVERY_NOTES_NAVIGATE, '/delivery-notes');
    } else if (event.key === 'F4') {
      event.preventDefault();
      this.goToIfPermitted(Permissions.USERS_NAVIGATE, '/users');
    }
  }

  private goToIfPermitted(permission: string, route: string) {
    if (this.authService.hasPermission(permission)) {
      this.router.navigateByUrl(route);
    }
  }
}
