import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MapGridComponent} from './map-grid-component/map-grid-component';
import {ReportsComponent} from './reports-component/reports-component';

const routes: Routes = [
  {path: '', redirectTo: 'map', pathMatch: 'full'},
  {path: 'map', component: MapGridComponent},
  {path: 'reports', component: ReportsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
