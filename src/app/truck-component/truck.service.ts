import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TruckLocation { x: number; y: number; }

export interface TruckResponse {
  truckId: string;
  location: TruckLocation;
  status: string;
  [key: string]: any;
}

export interface CreateTruckRequest {
  name: string;
  capacity: number;
}

@Injectable({ providedIn: 'root' })
export class TruckService {
  private readonly baseUrl = '/trucks';

  constructor(private http: HttpClient) {}

  register(request: CreateTruckRequest): Observable<TruckResponse> {
    return this.http.post<TruckResponse>(this.baseUrl, request);
  }

  findAll(): Observable<TruckResponse[]> {
    return this.http.get<TruckResponse[]>(this.baseUrl);
  }
}
