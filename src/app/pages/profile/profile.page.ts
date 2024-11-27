import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { AlimentosService } from 'src/app/services/alimentos.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userProfile: any;
  caloriasRecomendadas: number = 0;
  macronutrientesAcumulados = {
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
  };

  constructor(
    private supabaseService: SupabaseService,
    private alimentosService: AlimentosService
  ) {}

  async ngOnInit() {
    const user = await this.supabaseService.getUser();
    console.log('Usuario autenticado:', user); // Log

    if (user) {
      const profile = await this.supabaseService.getUserProfile(user.id);
      console.log('Perfil del usuario:', profile); // Log
      this.userProfile = profile;

      this.caloriasRecomendadas = this.calcularCalorias(
        profile.peso,
        profile.altura,
        profile.edad,
        profile.sexo,
        profile.objetivo,
        profile.nivelActividad
      );

      this.alimentosService.getMacronutrientesAcumulados().subscribe((macros) => {
        this.macronutrientesAcumulados = macros;
      });
    }
  }

  calcularCalorias(
    peso: number,
    altura: number,
    edad: number,
    sexo: string,
    objetivo: string,
    nivelActividad: string
  ): number {
    let bmr = 10 * peso + 6.25 * altura - 5 * edad;
    bmr += sexo === 'Masculino' ? 5 : -161;

    let factorActividad = 1.2;
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
    caloriasTotales *= 1.1;

    if (objetivo === 'Subir de peso') {
      caloriasTotales *= 1.1;
    } else if (objetivo === 'Bajar de peso') {
      caloriasTotales *= 0.9;
    }

    return parseFloat(caloriasTotales.toFixed(2));
  }
}
