// src/app/pages/register/register.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup; // Declarar el formulario

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder // Inyectar FormBuilder
  ) {
    // Inicializar el formulario con validaciones
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required]], // Validación para el nombre
      email: ['', [Validators.required, CustomValidators.emailPattern()]], // Validación para el correo
      password: ['', [Validators.required, Validators.minLength(6), CustomValidators.passwordStrength()]], // Validación para la contraseña
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.presentAlert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creando cuenta...',
    });
    await loading.present();

    try {
      await this.authService.register(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.nombre // Pasar el nombre
      );
      this.router.navigate(['/login']);
    } catch (error) {
      const errorMessage =
        (error as { message: string }).message || 'Error desconocido';
      this.presentAlert('Error al registrarse', errorMessage);
    } finally {
      loading.dismiss();
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
