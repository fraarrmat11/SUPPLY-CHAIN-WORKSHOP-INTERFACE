import { Component } from '@angular/core';
import {
  BlockedOrder,
  EventLog,
  OrderHistoryProjection,
  ReportsService,
  SystemStatsProjection,
} from './reports.service';

@Component({
  selector: 'app-reports-component',
  standalone: false,
  templateUrl: './reports-component.html',
  styleUrl: './reports-component.css',
})
export class ReportsComponent {
  blockedOrders: BlockedOrder[] = [];
  blockedOrderById: BlockedOrder | null = null;
  blockedOrderIdInput = '';

  eventLogs: EventLog[] = [];
  eventLogById: EventLog | null = null;
  eventLogIdInput = '';

  systemStats: SystemStatsProjection | null = null;
  orderHistory: OrderHistoryProjection[] = [];

  loadingMap: Record<string, boolean> = {};
  errorMap: Record<string, string> = {};

  constructor(private reportsService: ReportsService) {}

  private setLoading(key: string, value: boolean) {
    this.loadingMap[key] = value;
  }

  private setError(key: string, message: string) {
    this.errorMap[key] = message;
  }

  fetchAllBlockedOrders() {
    const key = 'blockedOrders';
    this.setLoading(key, true);
    this.errorMap[key] = '';
    this.reportsService.getAllBlockedOrders().subscribe({
      next: (data) => {
        this.blockedOrders = data;
        this.setLoading(key, false);
      },
      error: (err) => {
        this.setError(key, err.message);
        this.setLoading(key, false);
      },
    });
  }

  fetchBlockedOrderById() {
    const key = 'blockedOrderById';
    if (!this.blockedOrderIdInput.trim()) return;
    this.setLoading(key, true);
    this.errorMap[key] = '';
    this.reportsService.getBlockedOrderById(this.blockedOrderIdInput.trim()).subscribe({
      next: (data) => {
        this.blockedOrderById = data;
        this.setLoading(key, false);
      },
      error: (err) => {
        this.setError(key, err.message);
        this.setLoading(key, false);
      },
    });
  }

  fetchAllEventLogs() {
    const key = 'eventLogs';
    this.setLoading(key, true);
    this.errorMap[key] = '';
    this.reportsService.getAllEventLogs().subscribe({
      next: (data) => {
        this.eventLogs = data;
        this.setLoading(key, false);
      },
      error: (err) => {
        this.setError(key, err.message);
        this.setLoading(key, false);
      },
    });
  }

  fetchEventLogById() {
    const key = 'eventLogById';
    if (!this.eventLogIdInput.trim()) return;
    this.setLoading(key, true);
    this.errorMap[key] = '';
    this.reportsService.getEventLogById(this.eventLogIdInput.trim()).subscribe({
      next: (data) => {
        this.eventLogById = data;
        this.setLoading(key, false);
      },
      error: (err) => {
        this.setError(key, err.message);
        this.setLoading(key, false);
      },
    });
  }

  fetchSystemStats() {
    const key = 'systemStats';
    this.setLoading(key, true);
    this.errorMap[key] = '';
    this.reportsService.getSystemStats().subscribe({
      next: (data) => {
        this.systemStats = data;
        this.setLoading(key, false);
      },
      error: (err) => {
        this.setError(key, err.message);
        this.setLoading(key, false);
      },
    });
  }

  fetchOrderHistory() {
    const key = 'orderHistory';
    this.setLoading(key, true);
    this.errorMap[key] = '';
    this.reportsService.getOrderHistory().subscribe({
      next: (data) => {
        this.orderHistory = data;
        this.setLoading(key, false);
      },
      error: (err) => {
        this.setError(key, err.message);
        this.setLoading(key, false);
      },
    });
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
