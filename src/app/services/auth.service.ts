// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Estado de autenticación del usuario
  private authState = new BehaviorSubject<boolean>(false);

  constructor(
    private supabaseService: SupabaseService, // Servicio para interactuar con Supabase
    private router: Router // Servicio para la navegación entre páginas
  ) {
    // Verifica el estado de autenticación al iniciar el servicio
    this.checkAuthStatus();
  }

  // Método para verificar el estado de autenticación de forma asíncrona
  async checkAuthStatus() {
    // Obtener el usuario actual desde Supabase
    const user = await this.supabaseService.getUser();
    // Actualizar el estado de autenticación
    this.authState.next(!!user);
  }

  // Devuelve el estado de autenticación como observable
  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  // Método para iniciar sesión
  async login(email: string, password: string) {
    try {
      // Intentar iniciar sesión con el correo y la contraseña
      await this.supabaseService.signIn(email, password);
      // Obtener el usuario actual desde Supabase
      const user = await this.supabaseService.getUser();

      if (user) {
        // Verificar si el perfil del usuario está completo
        const isProfileComplete = await this.supabaseService.isProfileComplete(user.id);

        if (isProfileComplete) {
          // Si el perfil está completo, redirigir a la página de inicio
          this.router.navigate(['/home']);
        } else {
          // Si el perfil no está completo, redirigir a la página de completar perfil
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
      // Cerrar sesión en Supabase
      await this.supabaseService.signOut();
      // Actualizar el estado de autenticación
      this.authState.next(false);
      // Redirigir a la página de login
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  // Método para cerrar sesión (duplicado, se puede eliminar)
  async logout() {
    try {
      // Cerrar sesión en Supabase
      await this.supabaseService.signOut();
      // Actualizar el estado de autenticación
      this.authState.next(false);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
      throw error;
    }
  }

  // Método para registrarse
  async register(email: string, password: string, nombre: string) {
    try {
      // Registrar un nuevo usuario en Supabase
      await this.supabaseService.signUp(email, password, nombre);
      // Verificar el estado de autenticación tras registrarse
      this.checkAuthStatus();
    } catch (error) {
      console.error('Error al registrarse', error);
      throw error;
    }
  }
}