// src/app/pages/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { AlimentosService } from 'src/app/services/alimentos.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userProfile: any; // Declarar el perfil del usuario
  caloriasRecomendadas: number = 0; // Declarar las calorías recomendadas
  caloriasConsumidas: number = 0; // Declarar las calorías consumidas

  constructor(
    private supabaseService: SupabaseService, // Inyectar SupabaseService para interactuar con la base de datos
    private alimentosService: AlimentosService // Inyectar AlimentosService para obtener las calorías consumidas
  ) {}

  async ngOnInit() {
    // Obtener el usuario actual desde Supabase
    const user = await this.supabaseService.getUser();

    if (user) {
      // Obtener el perfil del usuario desde Supabase
      const profile = await this.supabaseService.getUserProfile(user.id);
      this.userProfile = profile;

      // Calcular las calorías recomendadas
      this.caloriasRecomendadas = this.calcularCalorias(
        profile.peso,
        profile.altura,
        profile.edad,
        profile.sexo,
        profile.objetivo,
        profile.nivelActividad
      );

      // Obtener las calorías consumidas
      this.alimentosService
        .obtenerCaloriasConsumidas()
        .subscribe((calorias) => {
          this.caloriasConsumidas = calorias;
        });
    }
  }

  // Método para calcular las calorías recomendadas
  calcularCalorias(
    peso: number,
    altura: number,
    edad: number,
    sexo: string,
    objetivo: string,
    nivelActividad: string
  ): number {
    // Calcular BMR usando la Mifflin-St Jeor Equation
    let bmr = 10 * peso + 6.25 * altura - 5 * edad;
    bmr += sexo === 'Masculino' ? 5 : -161;

    // Ajustar BMR según el nivel de actividad física
    let factorActividad = 1.2; // Sedentario
    switch (nivelActividad) {
      case 'Ligero':
        factorActividad = 1.375;
        break;
      case 'Moderado':
        factorActividad = 1.55;
        break;
      case 'Activo':
        factorActividad = 1.725;
        break;
      case 'Muy activo':
        factorActividad = 1.9;
        break;
    }

    let caloriasTotales = bmr * factorActividad;

    // Añadir el Efecto Térmico de los Alimentos (TEF)
    caloriasTotales *= 1.1;

    // Ajustar según el objetivo
    if (objetivo === 'Subir de peso') {
      return caloriasTotales * 1.1;
    } else if (objetivo === 'Bajar de peso') {
      return caloriasTotales * 0.9;
    } else {
      return caloriasTotales;
    }
  }
}
