import { HttpInterceptorFn } from '@angular/common/http';

/** Adds "Authorization: Bearer <token>" to every request, so the API knows who we are. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('campushub_token');
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};
