import { Component, NgZone, OnInit } from '@angular/core';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { OpenFoodFactsService } from 'src/app/services/openfoodfacts.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;

  barcode: string = '';
  productData: any = null;
  scanning: boolean = false;
  isSupported = false;
  isPermissionGranted = false;

  constructor(
    private openFoodFactsService: OpenFoodFactsService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
      console.log('Escáner de códigos de barras soportado:', this.isSupported);
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
      console.log('Permisos de cámara concedidos:', this.isPermissionGranted);
    });
    BarcodeScanner.removeAllListeners().then(() => {
      BarcodeScanner.addListener(
        'googleBarcodeScannerModuleInstallProgress',
        (event) => {
          this.ngZone.run(() => {
            console.log('Progreso de instalación del módulo de escaneo de códigos de barras de Google:', event);
          });
        },
      );
    });
  }

  async startScan() {
    try {
      console.log('Verificando permisos de cámara...');
      const status = await BarcodeScanner.checkPermissions();
      console.log('Estado de permisos de cámara:', status);
      if (status.camera !== 'granted') {
        console.log('Solicitando permisos de cámara...');
        const result = await BarcodeScanner.requestPermissions();
        console.log('Resultado de la solicitud de permisos de cámara:', result);
        if (result.camera !== 'granted') {
          console.error('Permiso de cámara no concedido');
          return;
        }
      }

      console.log('Iniciando escáner de códigos de barras...');
      this.scanning = true;

      const listener = await BarcodeScanner.addListener(
        'barcodeScanned',
        async result => {
          console.log('Código de barras escaneado:', result);
          this.barcode = result.barcode.toString();
          await listener.remove();
          await BarcodeScanner.stopScan();
          this.searchProduct();
        },
      );

      await BarcodeScanner.startScan();
      console.log('Escáner de códigos de barras iniciado');
    } catch (error) {
      console.error('Error al iniciar el escaneo:', error);
      this.scanning = false;
    }
  }

  async stopScan() {
    try {
      console.log('Deteniendo escáner de códigos de barras...');
      await BarcodeScanner.removeAllListeners();
      await BarcodeScanner.stopScan();
      this.scanning = false;
      console.log('Escáner de códigos de barras detenido');
    } catch (error) {
      console.error('Error al detener el escaneo:', error);
    }
  }

  searchProduct() {
    if (this.barcode.trim() === '') {
      console.log('No hay código de barras para buscar');
      return;
    }
    console.log('Buscando producto con código de barras:', this.barcode);
    this.openFoodFactsService.getProduct(this.barcode).subscribe((data: any) => {
      console.log('Datos del producto recibidos:', data);
      this.productData = data.product;
      this.scanning = false;
    }, (error: any) => {
      console.error('Error al buscar el producto:', error);
      this.productData = null;
      this.scanning = false;
    });
  }

  async requestPermissions() {
    await BarcodeScanner.requestPermissions();
  }

  async installGoogleBarcodeScannerModule() {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }
}