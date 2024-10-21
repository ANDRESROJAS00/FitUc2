// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false); // Estado de autenticación

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.checkAuthStatus(); // Verifica el estado de autenticación al iniciar
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
  async login(email: string, password: string) {
    try {
      await this.supabaseService.signIn(email, password);
      const user = await this.supabaseService.getUser();

      if (user) {
        // Verificamos si el perfil del usuario ya tiene los datos del IMC
        const isProfileComplete = await this.supabaseService.isProfileComplete(
          user.id
        );

        if (isProfileComplete) {
          // Si el perfil está completo, redirige a "home"
          this.router.navigate(['/home']);
        } else {
          // Si no está completo, redirige a "complete-profile"
          this.router.navigate(['/complete-profile']);
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      throw error;
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

  // Método para cerrar sesión
  async logout() {
    try {
      await this.supabaseService.signOut();
      this.authState.next(false);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
      throw error;
    }
  }


   // Método para registrarse
   async register(email: string, password: string, nombre: string) {
    try {
      await this.supabaseService.signUp(email, password, nombre);  // Ahora acepta el nombre también
      this.checkAuthStatus(); // Actualiza el estado de autenticación tras registrarse
    } catch (error) {
      console.error('Error al registrarse', error);
      throw error;
    }
  }






}
