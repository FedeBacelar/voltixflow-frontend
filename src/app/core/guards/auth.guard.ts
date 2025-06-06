import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredPermission = route.data?.['permission'] as string | undefined;

  if (!auth.isAuthenticated()) {
    router.navigateByUrl('/login');
    return false;
  }

  if (requiredPermission && !auth.hasPermission(requiredPermission)) {
    router.navigateByUrl('/unauthorized');
    return false;
  }

  return true;
};
