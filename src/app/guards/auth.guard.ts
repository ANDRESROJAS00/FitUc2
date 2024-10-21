import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SupabaseService } from '../services/supabase.service';
import { BehaviorSubject } from 'rxjs';
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
