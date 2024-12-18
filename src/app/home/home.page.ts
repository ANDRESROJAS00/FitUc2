// src/app/pages/home/home.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  goToAlimentos() {
    this.router.navigate(['/alimentos']);
  }

  // Función para redirigir a la página del escáner
  goToScanner() {
    this.router.navigate(['/scanner']);
  }

  // Función para redirigir a la página de completar perfil (IMC)
  goToCompleteProfile() {
    this.router.navigate(['/complete-profile']);
  }

  // Función para cerrar sesión
  signOut() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
