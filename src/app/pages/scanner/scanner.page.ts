import { Component, OnInit } from '@angular/core';
import {
  BarcodeScanner,
  BarcodeFormat,
} from '@capacitor-mlkit/barcode-scanning';
import { OpenFoodFactsService } from 'src/app/services/openfoodfacts.service';
import { Camera } from '@capacitor/camera';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  barcode: string = '';
  productData: any = null;
  scanning: boolean = false;

  constructor(private openFoodFactsService: OpenFoodFactsService) {}

  ngOnInit() {}

  async startScan() {
    const status = await Camera.checkPermissions();
    if (status.camera !== 'granted') {
      const result = await Camera.requestPermissions();
      if (result.camera !== 'granted') {
        console.error('Camera permission not granted');
        return;
      }
    }

    document.querySelector('body')?.classList.add('barcode-scanner-active');
    this.scanning = true;

    const listener = await BarcodeScanner.addListener(
      'barcodeScanned',
      async result => {
        this.barcode = result.barcode.toString();
        await listener.remove();
        document.querySelector('body')?.classList.remove('barcode-scanner-active');
        await BarcodeScanner.stopScan();
        this.searchProduct();
      },
    );

    await BarcodeScanner.startScan();
  }

  async stopScan() {
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
    await BarcodeScanner.removeAllListeners();
    await BarcodeScanner.stopScan();
    this.scanning = false;
  }

  searchProduct() {
    if (this.barcode.trim() === '') {
      return;
    }
    this.openFoodFactsService.getProduct(this.barcode).subscribe((data: any) => {
      this.productData = data.product;
      this.scanning = false;
    }, (error: any) => {
      console.error(error);
      this.productData = null;
      this.scanning = false;
    });
  }
}
