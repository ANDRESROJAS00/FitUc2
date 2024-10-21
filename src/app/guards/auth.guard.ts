import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  // Método canActivate que determina si una ruta puede ser activada
  canActivate(): Observable<boolean> {
    // Obtener el estado de autenticación del usuario
    return this.authService.getAuthState().pipe(
      switchMap(isAuthenticated => {
        // Si el usuario no está autenticado, redirigir a la página de login
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return [false];
        }

        // Obtener el usuario actual desde Supabase
        return from(this.supabaseService.getUser()).pipe(
          switchMap(user => {
            // Si no se encuentra un usuario, redirigir a la página de login
            if (!user) {
              this.router.navigate(['/login']);
              return [false];
            }

            // Verificar si el perfil del usuario está completo
            return from(this.supabaseService.isProfileComplete(user.id)).pipe(
              map(isComplete => {
                // Si el perfil no está completo, redirigir a la página de completar perfil
                if (!isComplete) {
                  this.router.navigate(['/complete-profile']);
                  return false;
                }
                // Si el perfil está completo, permitir el acceso a la ruta
                return true;
              })
            );
          })
        );
      })
    );
  }
}
