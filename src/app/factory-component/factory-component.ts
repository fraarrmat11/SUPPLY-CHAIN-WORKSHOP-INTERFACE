import { Component } from '@angular/core';
import { FactoryResponse, FactoryService, PlaceWarehouseOrderResponse, RecipeResponse } from './factory.service';

@Component({
  selector: 'app-factory-component',
  standalone: false,
  templateUrl: './factory-component.html',
  styleUrl: './factory-component.css',
})
export class FactoryComponent {
  // ── Factories ─────────────────────────────────────────────
  factoryByProduct: FactoryResponse | null = null;
  registeredFactory: FactoryResponse | null = null;
  productIdInput = '';
  factoryJson = '';

  // ── Recipes ───────────────────────────────────────────────
  recipes: RecipeResponse[] = [];
  registeredRecipe: RecipeResponse | null = null;
  recipeJson = '';

  // ── Warehouse Orders ──────────────────────────────────────
  placedOrder: PlaceWarehouseOrderResponse | null = null;
  orderWarehouseIdInput = '';
  orderProductIdInput = '';
  orderQuantityInput: number | null = null;

  loadingMap: Record<string, boolean> = {};
  errorMap: Record<string, string> = {};

  constructor(private factoryService: FactoryService) {}

  private start(key: string) { this.loadingMap[key] = true; this.errorMap[key] = ''; }
  private stop(key: string)  { this.loadingMap[key] = false; }
  private fail(key: string, err: any) { this.errorMap[key] = err.message ?? 'Unknown error'; this.stop(key); }

  registerFactory() {
    let body: any;
    try { body = JSON.parse(this.factoryJson); } catch { this.errorMap['regFactory'] = 'Invalid JSON'; return; }
    this.start('regFactory');
    this.factoryService.registerFactory(body).subscribe({
      next: (data) => { this.registeredFactory = data; this.stop('regFactory'); },
      error: (err) => this.fail('regFactory', err),
    });
  }

  findFactoryByProduct() {
    if (!this.productIdInput.trim()) return;
    this.start('findFactory');
    this.factoryService.findFactoryByProduct(this.productIdInput.trim()).subscribe({
      next: (data) => { this.factoryByProduct = data; this.stop('findFactory'); },
      error: (err) => this.fail('findFactory', err),
    });
  }

  registerRecipe() {
    let body: any;
    try { body = JSON.parse(this.recipeJson); } catch { this.errorMap['regRecipe'] = 'Invalid JSON'; return; }
    this.start('regRecipe');
    this.factoryService.registerRecipe(body).subscribe({
      next: (data) => { this.registeredRecipe = data; this.stop('regRecipe'); },
      error: (err) => this.fail('regRecipe', err),
    });
  }

  listRecipes() {
    this.start('recipes');
    this.factoryService.listRecipes().subscribe({
      next: (data) => { this.recipes = data; this.stop('recipes'); },
      error: (err) => this.fail('recipes', err),
    });
  }

  placeOrder() {
    if (!this.orderWarehouseIdInput.trim() || !this.orderProductIdInput.trim() || !this.orderQuantityInput || this.orderQuantityInput < 1) return;
    this.start('order');
    this.factoryService
      .placeOrder(this.orderWarehouseIdInput.trim(), {
        productId: this.orderProductIdInput.trim(),
        quantity: this.orderQuantityInput,
      })
      .subscribe({
        next: (data) => { this.placedOrder = data; this.stop('order'); },
        error: (err) => this.fail('order', err),
      });
  }

  objectKeys(obj: any): string[] { return obj ? Object.keys(obj) : []; }
}
