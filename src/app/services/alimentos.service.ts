import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AlimentosService {
  private SUPABASEURL = environment.SUPABASEURL; // URL de Supabase
  private apiKey = environment.SUPABASEAPIKEY; // API Key de Supabase
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
          // Realizar una solicitud GET para obtener los alimentos del usuario
          this.http.get(`${this.SUPABASEURL}/alimentos?select=*&id_usuario=eq.${user.id}`, { headers: this.headers })
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
          alimento.id_usuario = user.id; // Asignar el ID del usuario al alimento
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
          alimento.id_usuario = user.id; // Asignar el ID del usuario al alimento
          // Realizar una solicitud PATCH para actualizar el alimento
          this.http.patch(`${this.SUPABASEURL}/alimentos?id_alimento=eq.${id}`, alimento, { headers: this.headers })
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
          // Realizar una solicitud DELETE para eliminar el alimento
          this.http.delete(`${this.SUPABASEURL}/alimentos?id_alimento=eq.${id}&id_usuario=eq.${user.id}`, { headers: this.headers })
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

 // Obtener el total de calorías y macros consumidos en el día
 obtenerCaloriasYMacrosConsumidos(): Observable<any> {
  return new Observable(observer => {
    this.supabaseService.getUser().then(user => {
      if (user) {
        this.supabaseService.obtenerCaloriasYMacrosConsumidos(user.id).then(result => {
          observer.next(result);
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





