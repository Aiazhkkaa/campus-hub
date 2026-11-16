import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Only logged-in users. Others go to /login. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
};

/** Only logged-out users (landing, login, register). Logged-in users go to /home. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? inject(Router).createUrlTree(['/home']) : true;
};
