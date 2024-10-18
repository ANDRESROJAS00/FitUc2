// src/app/pages/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userProfile: any;
  caloriasRecomendadas: number = 0;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const user = await this.supabaseService.getUser();

    if (user) {
      const profile = await this.supabaseService.getUserProfile(user.id);
      this.userProfile = profile;

      this.caloriasRecomendadas = this.calcularCalorias(
        profile.peso,
        profile.altura,
        profile.edad,
        profile.sexo,
        profile.objetivo
      );
    }
  }

  calcularCalorias(peso: number, altura: number, edad: number, sexo: string, objetivo: string): number {
    let caloriasBase = (10 * peso) + (6.25 * altura) - (5 * edad);

    if (sexo === 'Masculino') {
      caloriasBase += 5;
    } else {
      caloriasBase -= 161;
    }

    if (objetivo === 'Subir de peso') {
      return caloriasBase * 1.1;
    } else if (objetivo === 'Bajar de peso') {
      return caloriasBase * 0.9;
    } else {
      return caloriasBase;
    }
  }
}



