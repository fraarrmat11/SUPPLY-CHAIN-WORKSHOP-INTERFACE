import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Entity { x: number; y: number; id: string; }
interface MapState { trucks: Entity[]; warehouses: Entity[]; }

@Component({
  standalone: false,
  selector: 'app-map-grid',
  templateUrl: './map-grid-component.html',
  styleUrls: ['./map-grid-component.css']
})
export class MapGridComponent implements OnInit {
  cells = Array.from({ length: 2500 }, (_, i) => ({ x: i % 50, y: Math.floor(i / 50) }));
  trucks: Entity[] = [];
  warehouses: Entity[] = [];
  days = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() { this.loadMapState(); }

  advanceDays() {
    this.http.post(`http://localhost:8081/tick/${this.days}`, {})
      .subscribe({
        next: () => setTimeout(() => this.loadMapState(), 500),
        error: (err) => console.error('Error avanzando días:', err)
      });
  }

  loadMapState() {
    this.http.get<MapState>('http://localhost:8080/map')
      .subscribe(data => {
        this.trucks = data.trucks.map((t: any) => ({
          id: t.truckId,
          x: t.location.x,
          y: t.location.y,
        }));
        this.warehouses = data.warehouses;
      });
  }

  isTruck(x: number, y: number) {
    return this.trucks.some(t => t.x === x && t.y === y);
  }

  isWarehouse(x: number, y: number) {
    return this.warehouses.some(w => w.x === x && w.y === y);
  }
}
