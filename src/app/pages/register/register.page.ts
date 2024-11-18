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
    private authService: AuthService, // Inyectar AuthService para manejar la autenticación
    private router: Router, // Inyectar Router para la navegación
    private alertController: AlertController, // Inyectar AlertController para mostrar alertas
    private loadingController: LoadingController, // Inyectar LoadingController para mostrar un indicador de carga
    private formBuilder: FormBuilder // Inyectar FormBuilder para construir el formulario
  ) {
    // Inicializar el formulario con validaciones
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required]], // Validación para el nombre
      email: ['', [Validators.required, CustomValidators.emailPattern()]], // Validación para el correo
      password: ['', [Validators.required, Validators.minLength(6), CustomValidators.passwordStrength()]], // Validación para la contraseña
    });
  }

  async onSubmit() {
    // Verificar si el formulario es inválido
    if (this.registerForm.invalid) {
      this.presentAlert('Error', 'Por favor completa todos los campos.');
      return;
    }
  
    // Mostrar un indicador de carga
    const loading = await this.loadingController.create({
      message: 'Creando cuenta...',
    });
    await loading.present();
  
    try {
      // Intentar registrar al usuario con los valores del formulario
      await this.authService.register(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.nombre // Pasar el nombre
      );
      // Redirigir a la página de login si el registro es exitoso
      this.router.navigate(['/login']);
    } catch (error) {
      // Mostrar un mensaje de error si el registro falla
      const errorMessage =
        (error as { message: string }).message || 'Error desconocido';
      this.presentAlert('Error al registrarse', errorMessage);
    } finally {
      // Ocultar el indicador de carga
      loading.dismiss();
    }
  }

  // Método para mostrar una alerta
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
