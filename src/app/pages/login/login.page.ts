// src/app/pages/login/login.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar FormBuilder, FormGroup y Validators

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup; // Declarar el formulario

  constructor(
    private authService: AuthService, // Inyectar AuthService para manejar la autenticación
    private router: Router, // Inyectar Router para la navegación
    private alertController: AlertController, // Inyectar AlertController para mostrar alertas
    private loadingController: LoadingController, // Inyectar LoadingController para mostrar un indicador de carga
    private formBuilder: FormBuilder // Inyectar FormBuilder para construir el formulario
  ) {
    // Inicializar el formulario con validaciones
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Validación de formato de correo
      password: ['', [Validators.required, Validators.minLength(6)]] // Contraseña con mínimo 6 caracteres
    });
  }

  // Método para manejar el envío del formulario
  async onSubmit() {
    // Verificar si el formulario es inválido
    if (this.loginForm.invalid) {
      this.presentAlert('Error', 'Por favor ingresa un correo válido y una contraseña de al menos 6 caracteres.');
      return;
    }

    // Mostrar un indicador de carga
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    try {
      // Intentar iniciar sesión con los valores del formulario
      await this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
      // Redirigir a la página de inicio si la autenticación es exitosa
      this.router.navigate(['/home']);
    } catch (error: unknown) {
      // Mostrar un mensaje de error si la autenticación falla
      const errorMessage = (error as { message: string }).message || 'Error desconocido';
      this.presentAlert('Error al iniciar sesión', errorMessage);
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
