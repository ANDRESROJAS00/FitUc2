import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://ssnrbbrnjivwmhciwrht.supabase.co', // Reemplaza con tu URL de Supabase
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzbnJiYnJuaml2d21oY2l3cmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0Mjc5MTUsImV4cCI6MjA0NDAwMzkxNX0.wUXrxMqXNr2r6fkT_efQINeMh6pbKwWu3z6KETZwZl8' // Reemplaza con tu Anon Key de Supabase
    );
  }

  // Método para obtener el perfil del usuario
  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('id_usuario', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Método para actualizar el perfil del usuario
  async updateUserProfile(profileData: any) {
    const { error } = await this.supabase
      .from('usuarios')
      .update(profileData)
      .eq('id_usuario', profileData.id_usuario);

    if (error) throw error;
  }

  // Obtener el usuario autenticado
  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data.user;  // Retorna el usuario autenticado
  }

  // Cerrar sesión
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }


  // Función para iniciar sesión con correo y contraseña
  async signIn(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  // Método para registrar un nuevo usuario y almacenarlo en la tabla "usuarios"
  async signUp(email: string, password: string, nombre: string) {
    // Paso 1: Registrar al usuario en Supabase Auth
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    const userId = data.user?.id; // UUID generado por Supabase
    if (userId) {
      // Paso 2: Almacenar al usuario en la tabla "usuarios" sin contraseña
      const { error: insertError } = await this.supabase
        .from('usuarios')
        .insert({
          id_usuario: userId, // Ahora UUID
          nombre: nombre,
          email: email,
          // No incluimos la contraseña
        });

      if (insertError) throw insertError;
    }
  }



  async isProfileComplete(userId: string): Promise<boolean> {
    const profile = await this.getUserProfile(userId);
    return (
      profile?.sexo &&
      profile?.edad &&
      profile?.altura &&
      profile?.peso &&
      profile?.objetivo
    );
  }
  
}
