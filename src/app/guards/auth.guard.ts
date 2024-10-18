// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router,
    private supabaseService: SupabaseService // Inyectamos el servicio para comprobar el perfil
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.getAuthState().pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return [false];
        }

        return this.supabaseService.getUser().then(user => {
          return this.supabaseService.isProfileComplete(user?.id).then(isComplete => {
            if (!isComplete) {
              this.router.navigate(['/complete-profile']); // Redirigir a completar perfil si no está completo
              return false;
            }
            return true;
          });
        });
      })
    );
  }
}

