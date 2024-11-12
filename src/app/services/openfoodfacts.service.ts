import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenFoodFactsService {
  private apiUrl = 'https://world.openfoodfacts.org/api/v0/product';

  constructor(private http: HttpClient) {}

  getProduct(barcode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${barcode}.json`);
  }
}