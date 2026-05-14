import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapGridComponent } from './map-grid-component/map-grid-component';
import { ReportsComponent } from './reports-component/reports-component';
import { WarehouseComponent } from './warehouse-component/warehouse-component';
import { TruckComponent } from './truck-component/truck-component';
import { FactoryComponent } from './factory-component/factory-component';

const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', component: MapGridComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'warehouses', component: WarehouseComponent },
  { path: 'trucks', component: TruckComponent },
  { path: 'factories', component: FactoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
