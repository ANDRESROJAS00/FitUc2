import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, Subject } from 'rxjs';
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

  private alimentosConsumidosSubject = new Subject<void>();
  private macronutrientesAcumulados = {
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
  };

  private macronutrientesSubject = new Subject<any>();

  constructor(private http: HttpClient, private supabaseService: SupabaseService) {}

  getAlimentosConsumidosObservable(): Observable<void> {
    return this.alimentosConsumidosSubject.asObservable();
  }

  getMacronutrientesAcumulados(): Observable<any> {
    return this.macronutrientesSubject.asObservable();
  }

  agregarMacronutrientes(macronutrientes: any) {
    this.macronutrientesAcumulados.calorias += macronutrientes.calorias;
    this.macronutrientesAcumulados.proteinas += macronutrientes.proteinas;
    this.macronutrientesAcumulados.carbohidratos += macronutrientes.carbohidratos;
    this.macronutrientesAcumulados.grasas += macronutrientes.grasas;
    this.macronutrientesSubject.next(this.macronutrientesAcumulados);
  }

  resetMacronutrientes() {
    this.macronutrientesAcumulados = {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
    };
    this.macronutrientesSubject.next(this.macronutrientesAcumulados);
  }

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
  addAlimento(alimento: any): Observable<any> {
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
          return this.http.post(`${this.SUPABASEURL}/registro_alimentos`, consumo, { headers: this.headers });
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

  // Notificar cambios en los alimentos consumidos
  notificarCambioEnAlimentosConsumidos() {
    this.alimentosConsumidosSubject.next();
  }
}