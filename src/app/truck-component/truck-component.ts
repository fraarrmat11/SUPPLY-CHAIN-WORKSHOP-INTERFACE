import { Component } from '@angular/core';
import { TruckResponse, TruckService } from './truck.service';

@Component({
  selector: 'app-truck-component',
  standalone: false,
  templateUrl: './truck-component.html',
  styleUrl: './truck-component.css',
})
export class TruckComponent {
  trucks: TruckResponse[] = [];
  registered: TruckResponse | null = null;

  nameInput = '';
  capacityInput: number | null = null;

  loadingMap: Record<string, boolean> = {};
  errorMap: Record<string, string> = {};

  constructor(private truckService: TruckService) {}

  private start(key: string) { this.loadingMap[key] = true; this.errorMap[key] = ''; }
  private stop(key: string)  { this.loadingMap[key] = false; }
  private fail(key: string, err: any) { this.errorMap[key] = err.message ?? 'Unknown error'; this.stop(key); }

  fetchAll() {
    this.start('list');
    this.truckService.findAll().subscribe({
      next: (data) => { this.trucks = data; this.stop('list'); },
      error: (err) => this.fail('list', err),
    });
  }

  register() {
    if (!this.nameInput.trim() || !this.capacityInput || this.capacityInput < 1) return;
    this.start('register');
    this.truckService.register({ name: this.nameInput.trim(), capacity: this.capacityInput }).subscribe({
      next: (data) => { this.registered = data; this.stop('register'); },
      error: (err) => this.fail('register', err),
    });
  }

  objectKeys(obj: any): string[] { return obj ? Object.keys(obj) : []; }
}
