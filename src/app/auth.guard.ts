import { inject } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { Router } from '@angular/router';

export const AuthGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.connecte()) {
    router.navigateByUrl('/connexion');
    return false;
  }
  return true;
};
