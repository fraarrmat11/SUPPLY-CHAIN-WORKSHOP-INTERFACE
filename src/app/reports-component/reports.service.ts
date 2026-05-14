import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BlockedOrder {
  [key: string]: any;
}

export interface EventLog {
  [key: string]: any;
}

export interface SystemStatsProjection {
  [key: string]: any;
}

export interface OrderHistoryProjection {
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly baseUrl = 'http://localhost:8082';

  constructor(private http: HttpClient) {}

  getAllBlockedOrders(): Observable<BlockedOrder[]> {
    return this.http.get<BlockedOrder[]>(`${this.baseUrl}/blockedOrders`);
  }

  getBlockedOrderById(id: string): Observable<BlockedOrder> {
    return this.http.get<BlockedOrder>(`${this.baseUrl}/blockedOrders/${id}`);
  }

  getAllEventLogs(): Observable<EventLog[]> {
    return this.http.get<EventLog[]>(`${this.baseUrl}/reports`);
  }

  getEventLogById(id: string): Observable<EventLog> {
    return this.http.get<EventLog>(`${this.baseUrl}/reports/${id}`);
  }

  getSystemStats(): Observable<SystemStatsProjection> {
    return this.http.get<SystemStatsProjection>(`${this.baseUrl}/reports/stats`);
  }

  getOrderHistory(): Observable<OrderHistoryProjection[]> {
    return this.http.get<OrderHistoryProjection[]>(`${this.baseUrl}/reports/orders/history`);
  }
}
