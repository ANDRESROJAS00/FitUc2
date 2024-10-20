import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService, 
    private readonly router: Router
  ) {}

  // Método que se ejecuta cuando el usuario está autenticado
  private handleAuthenticated(): Observable<boolean> {
    return of(true);  // Usuario autenticado, permitir acceso
  }

  // Método que se ejecuta cuando el usuario no está autenticado
  private handleNotAuthenticated(): Observable<boolean> {
    this.router.navigate(['/login']);  // No autenticado, redirigir a login
    return of(false);
  }

  // Método que se ejecuta si ocurre un error
  private handleError(): Observable<boolean> {
    this.router.navigate(['/login']);  // Si ocurre un error, redirigir a login
    return of(false);
  }

  canActivate(): Observable<boolean> {
    return this.authService.getAuthState().pipe(
      switchMap(isAuthenticated => 
        isAuthenticated ? this.handleAuthenticated() : this.handleNotAuthenticated()
      ),
      catchError(() => this.handleError())
    );
  }
}



