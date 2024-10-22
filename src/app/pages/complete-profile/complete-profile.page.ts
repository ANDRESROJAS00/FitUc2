// src/app/pages/complete-profile/complete-profile.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.page.html',
  styleUrls: ['./complete-profile.page.scss'],
})
export class CompleteProfilePage {
  profileForm: FormGroup; // Declarar el formulario de perfil

  constructor(
    private formBuilder: FormBuilder, // Inyectar FormBuilder para construir el formulario
    private supabaseService: SupabaseService, // Inyectar SupabaseService para interactuar con la base de datos
    private router: Router // Inyectar Router para la navegación
  ) {
    // Inicializar el formulario con validaciones
    this.profileForm = this.formBuilder.group({
      sexo: ['', Validators.required], // Campo requerido para el sexo
      edad: ['', [Validators.required, Validators.min(14)]], // Edad mínima de 14 años
      altura: ['', [Validators.required, Validators.min(50), Validators.max(250)]], // Altura entre 50 cm y 250 cm
      peso: ['', [Validators.required, Validators.min(20), Validators.max(300)]], // Peso entre 20 kg y 300 kg
      objetivo: ['', Validators.required], // Campo requerido para el objetivo
      nivelActividad: ['', Validators.required], // Campo requerido para el nivel de actividad
    });
  }

  async onSubmit() {
    // Verificar si el formulario es inválido
    if (this.profileForm.invalid) {
      return;
    }
  
    // Extraer los valores del formulario
    const { sexo, edad, altura, peso, objetivo, nivelActividad } = this.profileForm.value;
  
    // Obtener el usuario actual desde Supabase
    const user = await this.supabaseService.getUser();
  
    if (user) {
      // Actualiza el perfil en la base de datos
      await this.supabaseService.updateUserProfile({
        id_usuario: user.id,
        sexo,
        edad,
        altura,
        peso,
        objetivo,
        nivelActividad
      });
  
      // Redirige a 'home' después de que el perfil se haya completado
      this.router.navigate(['/home']);
    }
  }
}


