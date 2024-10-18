// src/app/pages/home/home.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) {}

  // Función para redirigir a la página de perfil
  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToAlimentos() {
    this.router.navigate(['/alimentos']);
  }

}

