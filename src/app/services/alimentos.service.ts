import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AlimentosService {
  private supabaseUrl = environment.supabaseUrl;
  private apiKey = environment.supabaseApiKey;
  private headers = new HttpHeaders({
    apikey: this.apiKey,
    Authorization: `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private supabaseService: SupabaseService) {}

  // Obtener todos los alimentos del usuario autenticado
  getAlimentos(): Observable<any> {
    return new Observable(observer => {
      this.supabaseService.getUser().then(user => {
        if (user) {
          this.http.get(`${this.supabaseUrl}/alimentos?select=*&id_usuario=eq.${user.id}`, { headers: this.headers })
            .subscribe(
              data => observer.next(data),
              error => observer.error(error)
            );
        } else {
          observer.error('User not authenticated');
        }
      });
    });
  }

  // Insertar un nuevo alimento
  addAlimento(alimento: any): Observable<any> {
    return new Observable(observer => {
      this.supabaseService.getUser().then(user => {
        if (user) {
          alimento.id_usuario = user.id;
          this.supabaseService.addAlimento(alimento).then(response => {
            observer.next(response);
            observer.complete();
          }).catch(error => {
            observer.error(error);
          });
        } else {
          observer.error('Usuario no autenticado');
        }
      });
    });
  }

  // Actualizar un alimento existente
  updateAlimento(id: number, alimento: any): Observable<any> {
    return new Observable(observer => {
      this.supabaseService.getUser().then(user => {
        if (user) {
          alimento.id_usuario = user.id;
          this.http.patch(`${this.supabaseUrl}/alimentos?id_alimento=eq.${id}`, alimento, { headers: this.headers })
            .subscribe(
              data => observer.next(data),
              error => observer.error(error)
            );
        } else {
          observer.error('User not authenticated');
        }
      });
    });
  }

  // Eliminar un alimento por ID
  deleteAlimento(id: number): Observable<any> {
    return new Observable(observer => {
      this.supabaseService.getUser().then(user => {
        if (user) {
          this.http.delete(`${this.supabaseUrl}/alimentos?id_alimento=eq.${id}&id_usuario=eq.${user.id}`, { headers: this.headers })
            .subscribe(
              data => observer.next(data),
              error => observer.error(error)
            );
        } else {
          observer.error('User not authenticated');
        }
      });
    });
  }


  // Registrar un alimento consumido
  registrarConsumo(idAlimento: number, cantidad: number): Observable<any> {
    return new Observable(observer => {
      this.supabaseService.getUser().then(user => {
        if (user) {
          const consumo = {
            id_usuario: user.id,
            id_alimento: idAlimento,
            cantidad: cantidad,
          };
          this.supabaseService.registrarConsumo(consumo).then(response => {
            observer.next(response);
            observer.complete();
          }).catch(error => {
            observer.error(error);
          });
        } else {
          observer.error('Usuario no autenticado');
        }
      });
    });
  }


  // Obtener el total de calorías consumidas en el día
  obtenerCaloriasConsumidas(): Observable<number> {
    return new Observable(observer => {
      this.supabaseService.getUser().then(user => {
        if (user) {
          this.supabaseService.obtenerCaloriasConsumidas(user.id).then(calorias => {
            observer.next(calorias);
            observer.complete();
          }).catch(error => {
            observer.error(error);
          });
        } else {
          observer.error('Usuario no autenticado');
        }
      });
    });
  }









}





