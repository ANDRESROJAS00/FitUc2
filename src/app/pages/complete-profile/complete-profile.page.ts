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
  profileForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      sexo: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(14)]], // Edad mínima de 14 años
      altura: ['', [Validators.required, Validators.min(50), Validators.max(250)]], // Altura entre 50 cm y 250 cm
      peso: ['', [Validators.required, Validators.min(20), Validators.max(300)]], // Peso entre 20 kg y 300 kg
      objetivo: ['', Validators.required],
      nivelActividad: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    const { sexo, edad, altura, peso, objetivo, nivelActividad } = this.profileForm.value;

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


