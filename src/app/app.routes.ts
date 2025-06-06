import { Routes } from '@angular/router';
import { VoltixLayoutComponent } from './layouts/voltix/voltix-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { Permissions } from './core/constants/permissions';

export const routes: Routes = [
  {
    path: '',
    component: VoltixLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'clients',
        data: { permission: Permissions.CLIENTS_NAVIGATE },
        loadChildren: () =>
          import('./features/clients/clients.routes').then(m => m.CLIENTS_ROUTES),
      },
      {
        path: 'inventory',
        data: { permission: Permissions.PRODUCTS_NAVIGATE },
        loadChildren: () =>
          import('./features/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES),
      },
      {
        path: 'delivery-notes',
        data: { permission: Permissions.DELIVERY_NOTES_NAVIGATE },
        loadChildren: () =>
          import('./features/delivery-notes/delivery-notes.routes').then(m => m.DELIVERY_NOTES_ROUTES),
      },
      {
        path: 'users',
        data: { permission: Permissions.USERS_NAVIGATE },
        loadChildren: () =>
          import('./features/users/users.routes').then(m => m.USERS_ROUTES),
      },
      { path: '', redirectTo: 'clients', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/pages/unauthorized.component').then(m => m.UnauthorizedComponent),
  },
  { path: '**', redirectTo: '' },
];
