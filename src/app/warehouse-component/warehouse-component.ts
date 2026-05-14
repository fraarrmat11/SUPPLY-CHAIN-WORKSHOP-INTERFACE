import { Component } from '@angular/core';
import { WarehouseDTO, WarehouseService } from './warehouse.service';

@Component({
  selector: 'app-warehouse-component',
  standalone: false,
  templateUrl: './warehouse-component.html',
  styleUrl: './warehouse-component.css',
})
export class WarehouseComponent {
  warehouses: WarehouseDTO[] = [];
  warehouseById: WarehouseDTO | null = null;
  availableWarehouse: WarehouseDTO | null = null;

  getByIdInput = '';
  deleteIdInput = '';
  assignWarehouseIdInput = '';
  assignFactoryIdInput = '';

  saveJson = '';
  updateIdInput = '';
  updateJson = '';

  responseMessage = '';

  loadingMap: Record<string, boolean> = {};
  errorMap: Record<string, string> = {};

  constructor(private warehouseService: WarehouseService) {}

  private start(key: string) {
    this.loadingMap[key] = true;
    this.errorMap[key] = '';
    this.responseMessage = '';
  }

  private stop(key: string) {
    this.loadingMap[key] = false;
  }

  private fail(key: string, err: any) {
    this.errorMap[key] = err.message ?? 'Unknown error';
    this.stop(key);
  }

  fetchAll() {
    this.start('list');
    this.warehouseService.getAllWarehouses().subscribe({
      next: (data) => { this.warehouses = data; this.stop('list'); },
      error: (err) => this.fail('list', err),
    });
  }

  fetchById() {
    if (!this.getByIdInput.trim()) return;
    this.start('byId');
    this.warehouseService.getWarehouseById(this.getByIdInput.trim()).subscribe({
      next: (data) => { this.warehouseById = data; this.stop('byId'); },
      error: (err) => this.fail('byId', err),
    });
  }

  fetchAvailable() {
    this.start('available');
    this.warehouseService.findAvailableWarehouse().subscribe({
      next: (data) => { this.availableWarehouse = data; this.stop('available'); },
      error: (err) => this.fail('available', err),
    });
  }

  save() {
    let body: WarehouseDTO;
    try { body = JSON.parse(this.saveJson); } catch { this.errorMap['save'] = 'Invalid JSON'; return; }
    this.start('save');
    this.warehouseService.saveWarehouse(body).subscribe({
      next: (msg) => { this.responseMessage = msg; this.stop('save'); },
      error: (err) => this.fail('save', err),
    });
  }

  update() {
    if (!this.updateIdInput.trim()) return;
    let body: WarehouseDTO;
    try { body = JSON.parse(this.updateJson); } catch { this.errorMap['update'] = 'Invalid JSON'; return; }
    this.start('update');
    this.warehouseService.updateWarehouse(this.updateIdInput.trim(), body).subscribe({
      next: (msg) => { this.responseMessage = msg; this.stop('update'); },
      error: (err) => this.fail('update', err),
    });
  }

  delete() {
    if (!this.deleteIdInput.trim()) return;
    this.start('delete');
    this.warehouseService.deleteWarehouse(this.deleteIdInput.trim()).subscribe({
      next: (msg) => { this.responseMessage = msg; this.stop('delete'); },
      error: (err) => this.fail('delete', err),
    });
  }

  assignFactory() {
    if (!this.assignWarehouseIdInput.trim() || !this.assignFactoryIdInput.trim()) return;
    this.start('assign');
    this.warehouseService
      .assignFactory(this.assignWarehouseIdInput.trim(), { factoryId: this.assignFactoryIdInput.trim() })
      .subscribe({
        next: (msg) => { this.responseMessage = msg; this.stop('assign'); },
        error: (err) => this.fail('assign', err),
      });
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
