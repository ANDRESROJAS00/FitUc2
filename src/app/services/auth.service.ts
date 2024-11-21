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
  private inactivityTimeout: any;

  constructor(
    private supabaseService: SupabaseService, // Servicio para interactuar con Supabase
    private router: Router // Servicio para la navegación entre páginas
  ) {
    // Verifica el estado de autenticación al iniciar el servicio
    this.checkAuthStatus();
    this.startInactivityTimer();
  }

  // Método para verificar el estado de autenticación de forma asíncrona
  async checkAuthStatus() {
    try {
      // Obtener el usuario actual desde Supabase
      const user = await this.supabaseService.getUser();
      // Actualizar el estado de autenticación
      this.authState.next(!!user);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Devuelve el estado de autenticación como observable
  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  // Método para iniciar sesión
  async login(email: string, password: string) {
    try {
      console.log('Iniciando sesión con:', email);
      // Intentar iniciar sesión con el correo y la contraseña
      await this.supabaseService.signIn(email, password);
      console.log('Inicio de sesión exitoso');

      // Verificar el estado de autenticación tras iniciar sesión
      await this.checkAuthStatus();

      // Redirigir a la página de inicio
      console.log('Redirigiendo a /home');
      this.router.navigate(['/home']);
      this.resetInactivityTimer();
    } catch (error) {
      this.handleError(error);
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
      this.handleError(error);
    }
  }

  // Método para registrarse
  async register(email: string, password: string, nombre: string) {
    try {
      // Registrar un nuevo usuario en Supabase
      await this.supabaseService.signUp(email, password, nombre);
      // Verificar el estado de autenticación tras registrarse
      await this.checkAuthStatus();
    } catch (error) {
      this.handleError(error);
    }
  }

  // Método privado para manejar errores
  private handleError(error: any) {
    console.error('Error:', error);
    throw error;
  }

  // Iniciar el temporizador de inactividad
  private startInactivityTimer() {
    this.resetInactivityTimer();
    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keydown', this.resetInactivityTimer.bind(this));
  }

  // Reiniciar el temporizador de inactividad
  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.signOut();
      alert('Sesión cerrada por inactividad.');
    }, 6 * 60 * 1000); // 6 minutos
  }
}