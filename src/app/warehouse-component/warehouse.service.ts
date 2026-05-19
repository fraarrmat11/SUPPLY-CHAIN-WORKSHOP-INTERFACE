import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WarehouseDTO {
  [key: string]: any;
}

export interface FactoryIdDTO {
  factoryId: string;
}

@Injectable({ providedIn: 'root' })
export class WarehouseService {
  private readonly baseUrl = '/warehouses';

  constructor(private http: HttpClient) {}

  getAllWarehouses(): Observable<WarehouseDTO[]> {
    return this.http.get<WarehouseDTO[]>(`${this.baseUrl}/list`);
  }

  getWarehouseById(id: string): Observable<WarehouseDTO> {
    return this.http.get<WarehouseDTO>(`${this.baseUrl}/${id}`);
  }

  saveWarehouse(warehouse: WarehouseDTO): Observable<string> {
    return this.http.post(`${this.baseUrl}`, warehouse, { responseType: 'text' });
  }

  updateWarehouse(id: string, warehouse: WarehouseDTO): Observable<string> {
    return this.http.put(`${this.baseUrl}/${id}`, warehouse, { responseType: 'text' });
  }

  deleteWarehouse(id: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  findAvailableWarehouse(): Observable<WarehouseDTO> {
    return this.http.get<WarehouseDTO>(`${this.baseUrl}/available`);
  }

  assignFactory(warehouseId: string, body: FactoryIdDTO): Observable<string> {
    return this.http.patch(`${this.baseUrl}/assignFactory/${warehouseId}`, body, { responseType: 'text' });
  }
}
