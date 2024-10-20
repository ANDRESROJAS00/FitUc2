import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlimentosService } from '../../services/alimentos.service';

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

  constructor(
    private alimentosService: AlimentosService,
    private formBuilder: FormBuilder
  ) {
    this.alimentoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      calorias: [0, Validators.required],
      proteinas: [0, Validators.required],
      carbohidratos: [0, Validators.required],
      grasas: [0, Validators.required],
      porcion: [0, Validators.required],
    });
  }

  ngOnInit() {
    this.loadAlimentos();
  }

  // Cargar alimentos desde Supabase
  loadAlimentos() {
    this.alimentosService.getAlimentos().subscribe(
      data => {
        this.alimentos = data;
      },
      error => {
        console.error('Error loading alimentos:', error);
      }
    );
  }

  // Agregar o actualizar alimento
  onSubmit() {
    if (this.alimentoForm.invalid) {
      return;
    }

    const alimento = this.alimentoForm.value;

    if (this.editMode && this.alimentoId !== null) {
      this.alimentosService.updateAlimento(this.alimentoId, alimento).subscribe(
        () => {
          this.loadAlimentos();
          this.resetForm();
        },
        error => {
          console.error('Error updating alimento:', error);
        }
      );
    } else {
      this.alimentosService.addAlimento(alimento).subscribe(
        () => {
          this.loadAlimentos();
          this.resetForm();
        },
        error => {
          console.error('Error adding alimento:', error);
        }
      );
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
    this.alimentosService.deleteAlimento(id).subscribe(
      () => {
        this.loadAlimentos();
      },
      error => {
        console.error('Error deleting alimento:', error);
      }
    );
  }

  // Reiniciar el formulario
  resetForm() {
    this.editMode = false;
    this.alimentoId = null;
    this.alimentoForm.reset({
      nombre: '',
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
      procion: 0,
    });
  }
}







