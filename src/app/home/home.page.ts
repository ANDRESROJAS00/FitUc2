// src/app/pages/home/home.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';  // Importa AuthService

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  constructor(private router: Router, private authService: AuthService) {}

  // Función para redirigir a la página de perfil
  goToProfile() {
    this.router.navigate(['/profile']);
  }

  // Función para redirigir a la página de alimentos
  goToAlimentos() {
    this.router.navigate(['/alimentos']);
  }

  // Función para cerrar sesión
  async logout() {
    await this.authService.logout();  // Llama a la función logout en AuthService
    this.router.navigate(['/login']);  // Redirige al usuario a la página de login
  }
}


