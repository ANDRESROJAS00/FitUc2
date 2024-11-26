import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient; // Cliente de Supabase

  constructor() {
    // Crear una instancia del cliente de Supabase
    this.supabase = createClient(
      'https://ssnrbbrnjivwmhciwrht.supabase.co', // URL de Supabase
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzbnJiYnJuaml2d21oY2l3cmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0Mjc5MTUsImV4cCI6MjA0NDAwMzkxNX0.wUXrxMqXNr2r6fkT_efQINeMh6pbKwWu3z6KETZwZl8' // API Key de Supabase
    );
  }

  // Método privado para manejar errores
  private handleError(error: any) {
    console.error('Error:', error);
    throw error;
  }

  // Obtener el perfil del usuario por ID
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('usuarios')
        .select('*')
        .eq('id_usuario', userId)
        .single();

      if (error) {
        this.handleError(error);
      }
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Actualizar el perfil del usuario
  async updateUserProfile(profileData: any) {
    try {
      const { error } = await this.supabase
        .from('usuarios')
        .update(profileData)
        .eq('id_usuario', profileData.id_usuario);

      if (error) {
        this.handleError(error);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // Obtener el usuario autenticado
  async getUser() {
    try {
      const { data, error } = await this.supabase.auth.getUser();
      if (error) {
        this.handleError(error);
      }
      return data?.user || null;
    } catch (error) {
      this.handleError(error);
    }
    return null;
  }

  // Iniciar sesión con correo y contraseña
  async signIn(email: string, password: string) {
    try {
      const { error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        this.handleError(error);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // Registrar un nuevo usuario
  async signUp(email: string, password: string, nombre: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        this.handleError(error);
      }

      const userId = data.user?.id;
      if (userId) {
        const { error: profileError } = await this.supabase
          .from('usuarios')
          .insert({ id_usuario: userId, nombre, email });

        if (profileError) {
          this.handleError(profileError);
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // Cerrar sesión
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        this.handleError(error);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // Agregar un nuevo alimento
  async addAlimento(alimento: any) {
    try {
      console.log('Agregando alimento:', alimento); // Log
      const { data, error } = await this.supabase
        .from('alimentos')
        .insert(alimento)
        .select(); // Asegúrate de que la respuesta incluya el ID del alimento

      if (error) {
        this.handleError(error);
      }
      console.log('Alimento agregado:', data); // Log
      return data;
    } catch (error) {
      this.handleError(error);
    }
    return null;
  }

  // Registrar el consumo de un alimento
  async registrarConsumo(consumo: any) {
    try {
      console.log('Registrando consumo:', consumo); // Log
      const { data, error } = await this.supabase
        .from('registro_alimentos')
        .insert(consumo);

      if (error) {
        this.handleError(error);
      }
      console.log('Consumo registrado:', data); // Log
      return data;
    } catch (error) {
      this.handleError(error);
    }
    return null;
  }
}