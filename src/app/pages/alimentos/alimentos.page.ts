// src/app/pages/alimentos/alimentos.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlimentosService } from 'src/app/services/alimentos.service';
import { SupabaseService } from 'src/app/services/supabase.service';  // Para obtener el userId

@Component({
  selector: 'app-alimentos',
  templateUrl: './alimentos.page.html',
  styleUrls: ['./alimentos.page.scss'],
})
export class AlimentosPage implements OnInit {
  alimentos: any[] = [];
  alimentoForm: FormGroup;
  editMode = false;
  alimentoId: number | null = null;
  userId: string | null = null;  // Para almacenar el ID del usuario autenticado
  

  constructor(
    private alimentosService: AlimentosService,
    private supabaseService: SupabaseService,  // Inyectamos SupabaseService para obtener el userId
    private formBuilder: FormBuilder
  ) {
    // Crear el formulario
    this.alimentoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      calorias: [0, Validators.required],
      proteinas: [0, Validators.required],
      carbohidratos: [0, Validators.required],
      grasas: [0, Validators.required],
      porcion: ['', Validators.required],
    });
  }

  async ngOnInit() {
    // Obtener el userId del usuario autenticado
    const user = await this.supabaseService.getUser();
    this.userId = user?.id || null;

    if (this.userId) {
      this.loadAlimentos();  // Cargar los alimentos si el usuario está autenticado
    }
  }

  // Cargar alimentos desde Supabase
  loadAlimentos() {
    if (this.userId) {
      this.alimentosService.getAlimentos(this.userId).subscribe((data) => {
        this.alimentos = data;
      });
    }
  }

  // Agregar o actualizar alimento
  onSubmit() {
    const alimentoData = this.alimentoForm.value;

    if (this.editMode && this.alimentoId) {
      // Actualizar el alimento
      this.alimentosService.updateAlimento(this.alimentoId, alimentoData).subscribe(() => {
        this.loadAlimentos(); // Volver a cargar la lista
        this.resetForm(); // Reiniciar el formulario
      });
    } else if (this.userId) {
      // Agregar un nuevo alimento
      this.alimentosService.addAlimento(alimentoData, this.userId).subscribe(() => {
        this.loadAlimentos(); // Volver a cargar la lista
        this.resetForm(); // Reiniciar el formulario
      });
    }
  }

  // Editar alimento
  editAlimento(alimento: any) {
    this.editMode = true;
    this.alimentoId = alimento.id_alimento;
    this.alimentoForm.patchValue(alimento);
  }

  // Eliminar alimento
  deleteAlimento(id: number) {
    this.alimentosService.deleteAlimento(id).subscribe(() => {
      this.loadAlimentos(); // Recargar los alimentos después de eliminar
    }, (error) => {
      console.error('Error eliminando el alimento', error);  // Maneja el error
    });
  }

  // Reiniciar el formulario
  resetForm() {
    this.alimentoForm.reset({
      nombre: '',
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
      porcion: '',
    });
    this.editMode = false;
    this.alimentoId = null;
  }
}








