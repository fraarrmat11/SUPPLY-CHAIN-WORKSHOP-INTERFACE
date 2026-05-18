import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, distinctUntilChanged } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

interface Entity { x: number; y: number; id: string; }
interface ApiTruck { truckId: string; location: { x: number; y: number }; }
interface ApiWarehouse { warehouseId: string; location: { x: number; y: number }; }
interface MapState { trucks: ApiTruck[]; warehouses: ApiWarehouse[]; }

const MAP_POLL_INTERVAL_MS = 1000;

@Component({
  standalone: false,
  selector: 'app-map-grid',
  templateUrl: './map-grid-component.html',
  styleUrls: ['./map-grid-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush  // clave: solo rerenderiza cuando los datos cambian de verdad
})
export class MapGridComponent implements OnInit, OnDestroy {
  private pollSub?: Subscription;

  cells = Array.from({ length: 2500 }, (_, i) => ({
    x: i % 50,
    y: Math.floor(i / 50),
    index: i  // ← para trackBy
  }));

  // Sets para O(1) lookup en lugar de .some() O(n) en cada celda
  private truckSet = new Set<string>();
  private warehouseSet = new Set<string>();

  trucks: Entity[] = [];
  warehouses: Entity[] = [];
  days = 1;
  hoveredCell = '';
  actualDay = 1;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadMapState();
    this.getActualDay();
    this.startPolling();
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  trackByIndex(_: number, cell: { index: number }) {
    return cell.index;  // evita que Angular destruya y recree las 2500 celdas en cada tick
  }

  advanceDays() {
    this.http.post(`/api/tick/${this.days}`, {}).subscribe({
      next: () => {
        this.getActualDay();
        this.loadMapState();
      },
      error: (err) => console.error('Error avanzando días:', err)
    });
  }

  loadMapState() {
    this.http.get<MapState>('/api/map').subscribe({
      next: (data) => {
        this.applyMapState(data);
        this.cdr.markForCheck();  // notifica a OnPush que hay cambios
      },
      error: (err) => console.error('Error cargando mapa:', err)
    });
  }

  getActualDay() {
    this.http.get<{ currentDay: number }>('/api/tick/current').subscribe({
      next: (data) => {
        this.actualDay = data.currentDay;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error obteniendo día:', err)
    });
  }

  startPolling() {
    this.pollSub = interval(MAP_POLL_INTERVAL_MS)
      .pipe(switchMap(() => this.http.get<MapState>('/api/map')))
      .subscribe({
        next: (data) => {
          this.applyMapState(data);
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Error en polling:', err)
      });
  }

  private applyMapState(data: MapState) {
    this.trucks = data.trucks.map(t => ({
      id: t.truckId,
      x: t.location.x,
      y: t.location.y,
    }));
    this.warehouses = data.warehouses.map(w => ({
      id: w.warehouseId,
      x: w.location.x,
      y: w.location.y,
    }));

    // Reconstruir los Sets para lookup rápido O(1)
    this.truckSet = new Set(this.trucks.map(t => `${t.x},${t.y}`));
    this.warehouseSet = new Set(this.warehouses.map(w => `${w.x},${w.y}`));
  }

  // O(1) en vez de O(n) — antes iteraba todos los camiones por cada celda
  isTruck(x: number, y: number) { return this.truckSet.has(`${x},${y}`); }
  isWarehouse(x: number, y: number) { return this.warehouseSet.has(`${x},${y}`); }

  getHoveredInfo(x: number, y: number) {
    const truck = this.trucks.find(t => t.x === x && t.y === y);
    if (truck) { this.hoveredCell = `Truck · ID: ${truck.id} · (${x}, ${y})`; return; }
    const wh = this.warehouses.find(w => w.x === x && w.y === y);
    if (wh) { this.hoveredCell = `Warehouse · ID: ${wh.id} · (${x}, ${y})`; return; }
    this.hoveredCell = `Empty cell · (${x}, ${y})`;
  }

  clearHovered() { this.hoveredCell = ''; }
}
