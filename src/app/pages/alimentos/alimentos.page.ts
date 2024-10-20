import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlimentosService } from '../../services/alimentos.service';
import { AlertController } from '@ionic/angular';

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
    private formBuilder: FormBuilder,
    private alertController: AlertController
  ) {
    this.alimentoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      calorias: [0, [Validators.required, Validators.min(0)]],
      proteinas: [0, [Validators.required, Validators.min(0)]],
      carbohidratos: [0, [Validators.required, Validators.min(0)]],
      grasas: [0, [Validators.required, Validators.min(0)]],
      porcion: ['', [Validators.required, Validators.maxLength(50)]],
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
  async deleteAlimento(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este alimento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.alimentosService.deleteAlimento(id).subscribe(
              () => {
                this.loadAlimentos();
              },
              error => {
                console.error('Error deleting alimento:', error);
              }
            );
          },
        },
      ],
    });

    await alert.present();
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
      porcion: '',
    });
  }
}






