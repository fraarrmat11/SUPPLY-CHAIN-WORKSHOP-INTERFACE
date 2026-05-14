import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let http: HttpTestingController;
  const base = 'http://localhost:8082';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportsService],
    });
    service = TestBed.inject(ReportsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify()); // verifica que no queden peticiones pendientes

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllBlockedOrders() hits GET /blockedOrders', () => {
    const mock = [{ id: '1', reason: 'test' }];
    service.getAllBlockedOrders().subscribe(data => expect(data).toEqual(mock));
    http.expectOne(`${base}/blockedOrders`).flush(mock);
  });

  it('getBlockedOrderById() hits GET /blockedOrders/:id', () => {
    const mock = { id: '42', reason: 'fraud' };
    service.getBlockedOrderById('42').subscribe(data => expect(data).toEqual(mock));
    http.expectOne(`${base}/blockedOrders/42`).flush(mock);
  });

  it('getAllEventLogs() hits GET /reports', () => {
    const mock = [{ eventId: 'e1', type: 'ORDER_PLACED' }];
    service.getAllEventLogs().subscribe(data => expect(data).toEqual(mock));
    http.expectOne(`${base}/reports`).flush(mock);
  });

  it('getEventLogById() hits GET /reports/:id', () => {
    const mock = { eventId: 'e99' };
    service.getEventLogById('e99').subscribe(data => expect(data).toEqual(mock));
    http.expectOne(`${base}/reports/e99`).flush(mock);
  });

  it('getSystemStats() hits GET /reports/stats', () => {
    const mock = { totalOrders: 100, blockedOrders: 5 };
    service.getSystemStats().subscribe(data => expect(data).toEqual(mock));
    http.expectOne(`${base}/reports/stats`).flush(mock);
  });

  it('getOrderHistory() hits GET /reports/orders/history', () => {
    const mock = [{ orderId: 'o1', status: 'DELIVERED' }];
    service.getOrderHistory().subscribe(data => expect(data).toEqual(mock));
    http.expectOne(`${base}/reports/orders/history`).flush(mock);
  });
});
