import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';
import { switchMap, catchError } from 'rxjs/operators';

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
    return from(this.supabaseService.getUser()).pipe(
      switchMap(user => {
        if (user) {
          return this.http.get(`${this.SUPABASEURL}/alimentos?select=*&id_usuario=eq.${user.id}`, { headers: this.headers });
        } else {
          throw new Error('User not authenticated');
        }
      }),
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }

  // Insertar un nuevo alimento
  insertarAlimento(alimento: any): Observable<any> {
    return from(this.supabaseService.getUser()).pipe(
      switchMap(user => {
        if (user) {
          alimento.id_usuario = user.id; // Asignar el ID del usuario al alimento
          return this.http.post(`${this.SUPABASEURL}/alimentos`, alimento, { headers: this.headers });
        } else {
          throw new Error('User not authenticated');
        }
      }),
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }

  // Actualizar un alimento existente
  updateAlimento(id: number, alimento: any): Observable<any> {
    return from(this.supabaseService.getUser()).pipe(
      switchMap(user => {
        if (user) {
          alimento.id_usuario = user.id; // Asignar el ID del usuario al alimento
          return this.http.patch(`${this.SUPABASEURL}/alimentos?id_alimento=eq.${id}`, alimento, { headers: this.headers });
        } else {
          throw new Error('User not authenticated');
        }
      }),
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }

  // Eliminar un alimento por ID
  deleteAlimento(id: number): Observable<any> {
    return from(this.supabaseService.getUser()).pipe(
      switchMap(user => {
        if (user) {
          return this.http.delete(`${this.SUPABASEURL}/alimentos?id_alimento=eq.${id}&id_usuario=eq.${user.id}`, { headers: this.headers });
        } else {
          throw new Error('User not authenticated');
        }
      }),
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }

  // Obtener el total de calorías y macros consumidos en el día
  obtenerCaloriasYMacrosConsumidos(): Observable<any> {
    return new Observable(observer => {
      this.supabaseService.getUser().then(user => {
        if (user) {
          this.supabaseService
            .obtenerCaloriasYMacrosConsumidos(user.id)
            .then(result => {
              observer.next(result);
              observer.complete();
            })
            .catch(error => {
              observer.error(error);
            });
        } else {
          observer.error('Usuario no autenticado');
        }
      });
    });
  }

  // Agregar un nuevo alimento
  addAlimento(alimento: any): Observable<any> {
    return this.insertarAlimento(alimento);
  }

  // Registrar el consumo de un alimento
  registrarConsumo(idAlimento: number, cantidad: number): Observable<any> {
    return from(this.supabaseService.getUser()).pipe(
      switchMap(user => {
        if (user) {
          const consumo = {
            id_usuario: user.id,
            id_alimento: idAlimento,
            cantidad: cantidad,
            fecha: new Date().toISOString(),
          };
          return this.http.post(`${this.SUPABASEURL}/consumos`, consumo, { headers: this.headers });
        } else {
          throw new Error('User not authenticated');
        }
      }),
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }
}
