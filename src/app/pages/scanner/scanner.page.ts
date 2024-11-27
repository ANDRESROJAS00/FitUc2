import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AlimentosService } from 'src/app/services/alimentos.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  barcode: string = ''; // Definir la propiedad barcode
  productData: any = null;

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
    private alimentosService: AlimentosService
  ) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    }).catch((error) => {
      console.error('Error al verificar si el escáner de códigos de barras es compatible:', error);
    });

    this.installGoogleBarcodeScannerModule();
  }

  async installGoogleBarcodeScannerModule(): Promise<void> {
    try {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
      console.log('Módulo de escaneo de códigos de barras de Google instalado.');
    } catch (error) {
      console.error('Error al instalar el módulo de escaneo de códigos de barras de Google:', error);
    }
  }

  async scan(): Promise<void> {
    try {
      const granted = await this.requestPermissions();
      if (!granted) {
        this.presentAlert('Permiso denegado', 'Por favor, concede permiso para usar la cámara.');
        return;
      }

      const { barcodes } = await BarcodeScanner.scan();
      this.barcodes.push(...barcodes);

      if (barcodes.length > 0) {
        this.barcode = barcodes[0].displayValue || '';
        this.searchProduct(this.barcode);
      }
    } catch (error) {
      console.error('Error durante el escaneo:', error);
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      return camera === 'granted' || camera === 'limited';
    } catch (error) {
      console.error('Error al solicitar permisos de cámara:', error);
      return false;
    }
  }

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentConfirmAlert(productData: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Agregar Alimento',
      message: `¿Deseas agregar ${productData.product_name} como alimento consumido?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: () => {
            this.addConsumedFood(productData);
          },
        },
      ],
    });
    await alert.present();
  }

  searchProduct(barcode: string) {
    if (barcode.trim() === '') {
      console.log('No hay código de barras para buscar');
      return;
    }

    const url = `https://cl.openfoodfacts.org/api/v0/product/${barcode}.json`;
    this.http.get(url).subscribe((data: any) => {
      if (data.status === 1) {
        this.productData = data.product;
        this.presentConfirmAlert(this.productData);
      } else {
        this.productData = null;
        this.presentAlert('Producto no encontrado', 'No se encontraron datos del producto para el código de barras escaneado.');
      }
    }, (error: any) => {
      console.error('Error al buscar datos del producto:', error);
      this.productData = null;
    });
  }

  addConsumedFood(productData: any) {
    const alimento = {
      nombre: productData.product_name,
      calorias: productData.nutriments.energy_value,
      proteinas: productData.nutriments.proteins_value,
      carbohidratos: productData.nutriments.carbohydrates_value,
      grasas: productData.nutriments.fat_value,
      porcion: productData.serving_size || '1 porción',
    };

    this.alimentosService.addAlimento(alimento).subscribe(
      (response) => {
        const idAlimento = response[0].id_alimento;
        this.alimentosService.registrarConsumo(idAlimento, 1).subscribe(() => {
          console.log('Consumo registrado');
          this.alimentosService.notificarCambioEnAlimentosConsumidos();
          this.alimentosService.agregarMacronutrientes(alimento); // Acumular macronutrientes
        });
      },
      (error) => {
        console.error('Error al agregar alimento:', error);
      }
    );
  }
}