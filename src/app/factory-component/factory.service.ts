import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FactoryResponse {
  id: string;
  name: string;
  locationX: number;
  locationY: number;
  warehouseId: string;
  recipeIds: string[];
}

export interface RegisterFactoryRequest {
  name: string;
  locationX: number;
  locationY: number;
  assignedRecipeIds: string[];
}

export interface RecipeIngredient { productId: string; quantity: number; }

export interface RecipeResponse {
  id: string;
  name: string;
  inputs: RecipeIngredient[];
  outputProductId: string;
  buildTimeInDays: number;
}

export interface RegisterRecipeRequest {
  name: string;
  inputs: RecipeIngredient[];
  outputProductId: string;
  buildTimeInDays: number;
}

export interface PlaceWarehouseOrderRequest { productId: string; quantity: number; }

export interface PlaceWarehouseOrderResponse {
  orderId: string;
  productionOrderId: string;
  warehouseId: string;
  productId: string;
  factoryAssigned: string;
  quantity: number;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class FactoryService {
  private readonly factoryUrl = '/factories';
  private readonly recipeUrl  = '/recipes';
  private readonly orderUrl   = '/warehouses';

  constructor(private http: HttpClient) {}

  // ── Factories ────────────────────────────────────────────────
  registerFactory(request: RegisterFactoryRequest): Observable<FactoryResponse> {
    return this.http.post<FactoryResponse>(this.factoryUrl, request);
  }

  findFactoryByProduct(productId: string): Observable<FactoryResponse> {
    return this.http.get<FactoryResponse>(`${this.factoryUrl}/${productId}`);
  }

  // ── Recipes ──────────────────────────────────────────────────
  registerRecipe(request: RegisterRecipeRequest): Observable<RecipeResponse> {
    return this.http.post<RecipeResponse>(this.recipeUrl, request);
  }

  listRecipes(): Observable<RecipeResponse[]> {
    return this.http.get<RecipeResponse[]>(this.recipeUrl);
  }

  // ── Warehouse Orders ─────────────────────────────────────────
  placeOrder(warehouseId: string, request: PlaceWarehouseOrderRequest): Observable<PlaceWarehouseOrderResponse> {
    return this.http.post<PlaceWarehouseOrderResponse>(
      `${this.orderUrl}/${warehouseId}/orders`,
      request
    );
  }
}
