import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SupabaseService } from '../services/supabase.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  // Método para verificar el estado de autenticación de forma asíncrona
  async checkAuthStatus() {
    const user = await this.supabaseService.getUser();
    this.authState.next(!!user);
  }

  // Devuelve el estado de autenticación como observable
  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  // Método para iniciar sesión
  async signIn(email: string, password: string) {
    try {
      await this.supabaseService.signIn(email, password);
      this.authState.next(true);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  // Método para cerrar sesión
  async signOut() {
    try {
      await this.supabaseService.signOut();
      this.authState.next(false);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.getAuthState().pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return [false];
        }

        return from(this.supabaseService.getUser()).pipe(
          switchMap(user => {
            if (!user) {
              this.router.navigate(['/login']);
              return [false];
            }

            return from(this.supabaseService.isProfileComplete(user.id)).pipe(
              map(isComplete => {
                if (!isComplete) {
                  this.router.navigate(['/complete-profile']);
                  return false;
                }
                return true;
              })
            );
          })
        );
      })
    );
  }
}
