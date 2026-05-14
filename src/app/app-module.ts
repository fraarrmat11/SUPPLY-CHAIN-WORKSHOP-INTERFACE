import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MapGridComponent } from './map-grid-component/map-grid-component';
import { ReportsComponent } from './reports-component/reports-component';

@NgModule({
  declarations: [App, MapGridComponent, ReportsComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  bootstrap: [App],
})
export class AppModule {}
