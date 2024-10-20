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
     private readonly authService: AuthService,
     private readonly router: Router,
     private readonly alertController: AlertController,
     private readonly loadingController: LoadingController,
     private readonly formBuilder: FormBuilder // Inyectar FormBuilder
   ) {
     // Inicializar el formulario con validaciones
     this.loginForm = this.formBuilder.group({
       email: ['', [Validators.required, Validators.email]], // Validación de formato de correo
       password: ['', [Validators.required, Validators.minLength(6)]] // Contraseña con mínimo 6 caracteres
     });
   }
 
   async onSubmit() {
     if (this.loginForm.invalid) {
       this.presentAlert('Error', 'Por favor ingresa un correo válido y una contraseña de al menos 6 caracteres.');
       return;
     }
 
     const loading = await this.loadingController.create({
       message: 'Iniciando sesión...',
     });
     await loading.present();
 
     try {
       await this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
       this.router.navigate(['/home']);
     } catch (error: unknown) {
       const errorMessage = (error as { message: string }).message || 'Error desconocido';
       this.presentAlert('Error al iniciar sesión', errorMessage);
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
