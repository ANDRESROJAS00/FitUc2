// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.getAuthState().pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return of(true);  // Usuario autenticado, permitir acceso
        } else {
          this.router.navigate(['/login']);  // No autenticado, redirigir a login
          return of(false);
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']);  // Si ocurre un error, redirigir a login
        return of(false);
      })
    );
  }
}


