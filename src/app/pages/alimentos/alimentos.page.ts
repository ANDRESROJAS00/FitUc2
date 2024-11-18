import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlimentosService } from '../../services/alimentos.service';

@Component({
  selector: 'app-alimentos',
  templateUrl: './alimentos.page.html',
  styleUrls: ['./alimentos.page.scss'],
})
export class AlimentosPage implements OnInit {
  alimentos: any[] = []; // Declarar el array de alimentos
  alimentoForm: FormGroup; // Declarar el formulario de alimentos
  editMode = false; // Modo de edición
  alimentoId: number | null = null; // ID del alimento a editar

  constructor(
    private alimentosService: AlimentosService, // Inyectar AlimentosService para interactuar con la base de datos
    private formBuilder: FormBuilder // Inyectar FormBuilder para construir el formulario
  ) {
    // Inicializar el formulario con validaciones
    this.alimentoForm = this.formBuilder.group({
      nombre: ['', Validators.required], // Campo requerido para el nombre del alimento
      calorias: [0, Validators.required], // Campo requerido para las calorías
      proteinas: [0, Validators.required], // Campo requerido para las proteínas
      carbohidratos: [0, Validators.required], // Campo requerido para los carbohidratos
      grasas: [0, Validators.required], // Campo requerido para las grasas
      porcion: [0, Validators.required], // Campo requerido para la porción
    });
  }

  ngOnInit() {
    // Cargar los alimentos al inicializar el componente
    this.loadAlimentos();
  }

  // Método para cargar los alimentos desde Supabase
  loadAlimentos() {
    this.alimentosService.getAlimentos().subscribe(
      (data) => {
        this.alimentos = data;
      },
      (error) => {
        console.error('Error loading alimentos:', error);
      }
    );
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    // Verificar si el formulario es inválido
    if (this.alimentoForm.invalid) {
      return;
    }

    const alimento = this.alimentoForm.value;

    // Si está en modo de edición, actualizar el alimento
    if (this.editMode && this.alimentoId !== null) {
      this.alimentosService.updateAlimento(this.alimentoId, alimento).subscribe(
        () => {
          this.loadAlimentos();
          this.resetForm();
        },
        (error) => {
          console.error('Error updating alimento:', error);
        }
      );
    } else {
      // Si no está en modo de edición, agregar un nuevo alimento
      this.alimentosService.addAlimento(alimento).subscribe(
        (response) => {
          this.loadAlimentos();
          this.resetForm();
          // Registrar el alimento como consumido
          const idAlimento = response[0].id_alimento; // Asegúrate de que la respuesta contenga el ID del alimento
          this.registrarConsumo(idAlimento, 1); // Asume que la cantidad consumida es 1 por defecto
        },
        (error) => {
          console.error('Error adding alimento:', error);
        }
      );
    }
  }

  // Método para editar un alimento
  editAlimento(alimento: any) {
    this.editMode = true;
    this.alimentoId = alimento.id_alimento;
    this.alimentoForm.patchValue(alimento);
  }

  // Método para eliminar un alimento
  deleteAlimento(id: number) {
    this.alimentosService.deleteAlimento(id).subscribe(
      () => {
        this.loadAlimentos();
      },
      (error) => {
        console.error('Error deleting alimento:', error);
      }
    );
  }

  // Método para registrar el consumo de un alimento
  registrarConsumo(idAlimento: number, cantidad: number) {
    this.alimentosService
      .registrarConsumo(idAlimento, cantidad)
      .subscribe(() => {
        console.log('Consumo registrado');
      });
  }

  // Método para reiniciar el formulario
  resetForm() {
    this.editMode = false;
    this.alimentoId = null;
    this.alimentoForm.reset({
      nombre: '',
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
      porcion: 0,
    });
  }
}
