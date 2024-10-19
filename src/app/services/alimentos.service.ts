// src/app/services/alimentos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

  constructor(private http: HttpClient) {}

  // Obtener todos los alimentos de un usuario
  getAlimentos(userId: string): Observable<any> {
    return this.http.get(`${this.supabaseUrl}/alimentos?select=*&id_usuario=eq.${userId}`, { headers: this.headers });
  }

  // Insertar un nuevo alimento
  addAlimento(alimento: any, userId: string): Observable<any> {
    const alimentoData = { ...alimento, id_usuario: userId }; // Asociar el alimento con el usuario
    return this.http.post(`${this.supabaseUrl}/alimentos`, alimentoData, { headers: this.headers });
  }

  // Actualizar un alimento existente
  updateAlimento(id: number, alimento: any): Observable<any> {
    return this.http.patch(`${this.supabaseUrl}/alimentos?id_alimento=eq.${id}`, alimento, { headers: this.headers });
  }

  // Eliminar un alimento por ID
  deleteAlimento(id: number): Observable<any> {
    return this.http.delete(`${this.supabaseUrl}/alimentos?id_alimento=eq.${id}`, { headers: this.headers });
  }


}






