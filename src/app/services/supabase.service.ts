// src/app/services/supabase.service.ts

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

  // Obtener el perfil del usuario por ID
  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('id_usuario', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    return data;
  }

  // Actualizar el perfil del usuario
  async updateUserProfile(profileData: any) {
    const { error } = await this.supabase
      .from('usuarios')
      .update(profileData)
      .eq('id_usuario', profileData.id_usuario);

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Obtener el usuario autenticado
  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error);
      throw error;
    }
    return data.user;
  }

  // Iniciar sesión con correo y contraseña
  async signIn(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Registrar un nuevo usuario
  async signUp(email: string, password: string, nombre: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }

    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await this.supabase
        .from('usuarios')
        .insert({ id_usuario: userId, nombre, email });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        throw profileError;
      }
    }
  }

  // Cerrar sesión
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Verificar si el perfil del usuario está completo
  async isProfileComplete(userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('peso, altura, edad, sexo, objetivo, nivelActividad')
      .eq('id_usuario', userId)
      .single();

    if (error) {
      console.error('Error checking profile completeness:', error);
      throw error;
    }

    return !!(
      data.peso &&
      data.altura &&
      data.edad &&
      data.sexo &&
      data.objetivo &&
      data?.nivelActividad
    );
  }

  // Agregar un nuevo alimento
  async addAlimento(alimento: any) {
    const { data, error } = await this.supabase
      .from('alimentos')
      .insert(alimento)
      .select(); // Asegúrate de que la respuesta incluya el ID del alimento

    if (error) {
      console.error('Error adding alimento:', error);
      throw error;
    }
    return data;
  }

  // Registrar el consumo de un alimento
  async registrarConsumo(consumo: any) {
    console.log('Registrando consumo:', consumo); // Log
    const { data, error } = await this.supabase
      .from('alimentos_consumidos')
      .insert(consumo);

    if (error) {
      console.error('Error registrando consumo:', error);
      throw error;
    }
    console.log('Consumo registrado:', data); // Log
    return data;
  }

  // Obtener el total de calorías consumidas en el día
  async obtenerCaloriasConsumidas(userId: string): Promise<number> {
    console.log('Obteniendo calorías consumidas para el usuario:', userId); // Log

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from('alimentos_consumidos')
      .select(
        `
      cantidad,
      alimentos (
        calorias
      )
    `
      )
      .eq('id_usuario', userId)
      .gte('fecha_consumo', `${today}T00:00:00`)
      .lte('fecha_consumo', `${today}T23:59:59`);

    if (error) {
      console.error('Error obteniendo calorías consumidas:', error);
      throw error;
    }

    console.log('Datos de calorías consumidas:', data); // Log
    return data.reduce((total: number, consumo: any) => {
      return total + consumo.cantidad * consumo.alimentos.calorias;
    }, 0);
  }
}