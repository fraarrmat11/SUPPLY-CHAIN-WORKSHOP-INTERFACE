import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ReportsComponent } from './reports-component';
import { ReportsService } from './reports.service';

const mockService = {
  getAllBlockedOrders: vi.fn().mockReturnValue(of([])),
  getBlockedOrderById: vi.fn().mockReturnValue(of({})),
  getAllEventLogs: vi.fn().mockReturnValue(of([])),
  getEventLogById: vi.fn().mockReturnValue(of({})),
  getSystemStats: vi.fn().mockReturnValue(of({})),
  getOrderHistory: vi.fn().mockReturnValue(of([])),
};

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockService.getAllBlockedOrders.mockReturnValue(of([]));
    mockService.getBlockedOrderById.mockReturnValue(of({}));
    mockService.getAllEventLogs.mockReturnValue(of([]));
    mockService.getEventLogById.mockReturnValue(of({}));
    mockService.getSystemStats.mockReturnValue(of({}));
    mockService.getOrderHistory.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [ReportsComponent],
      imports: [FormsModule],
      providers: [{ provide: ReportsService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── fetchAllBlockedOrders ────────────────────────────────────

  it('fetchAllBlockedOrders() populates blockedOrders', () => {
    const data = [{ id: '1', reason: 'fraud' }];
    mockService.getAllBlockedOrders.mockReturnValue(of(data));
    component.fetchAllBlockedOrders();
    expect(component.blockedOrders).toEqual(data);
    expect(component.loadingMap['blockedOrders']).toBeFalsy();
  });

  it('fetchAllBlockedOrders() sets error on failure', () => {
    mockService.getAllBlockedOrders.mockReturnValue(throwError(() => new Error('Network error')));
    component.fetchAllBlockedOrders();
    expect(component.errorMap['blockedOrders']).toBe('Network error');
    expect(component.blockedOrders.length).toBe(0);
  });

  // ── fetchBlockedOrderById ────────────────────────────────────

  it('fetchBlockedOrderById() does nothing when input is empty', () => {
    component.blockedOrderIdInput = '  ';
    component.fetchBlockedOrderById();
    expect(mockService.getBlockedOrderById).not.toHaveBeenCalled();
  });

  it('fetchBlockedOrderById() populates blockedOrderById', () => {
    const data = { id: '42', reason: 'test' };
    mockService.getBlockedOrderById.mockReturnValue(of(data));
    component.blockedOrderIdInput = '42';
    component.fetchBlockedOrderById();
    expect(component.blockedOrderById).toEqual(data);
  });

  // ── fetchAllEventLogs ────────────────────────────────────────

  it('fetchAllEventLogs() populates eventLogs', () => {
    const data = [{ eventId: 'e1', type: 'ORDER_PLACED' }];
    mockService.getAllEventLogs.mockReturnValue(of(data));
    component.fetchAllEventLogs();
    expect(component.eventLogs).toEqual(data);
  });

  it('fetchAllEventLogs() sets error on failure', () => {
    mockService.getAllEventLogs.mockReturnValue(throwError(() => new Error('500')));
    component.fetchAllEventLogs();
    expect(component.errorMap['eventLogs']).toBe('500');
  });

  // ── fetchSystemStats ─────────────────────────────────────────

  it('fetchSystemStats() populates systemStats', () => {
    const data = { totalOrders: 10, blockedOrders: 2 };
    mockService.getSystemStats.mockReturnValue(of(data));
    component.fetchSystemStats();
    expect(component.systemStats).toEqual(data);
  });

  // ── fetchOrderHistory ────────────────────────────────────────

  it('fetchOrderHistory() populates orderHistory', () => {
    const data = [{ orderId: 'o1', status: 'DELIVERED' }];
    mockService.getOrderHistory.mockReturnValue(of(data));
    component.fetchOrderHistory();
    expect(component.orderHistory).toEqual(data);
  });

  // ── objectKeys helper ────────────────────────────────────────

  it('objectKeys() returns keys of an object', () => {
    expect(component.objectKeys({ a: 1, b: 2 })).toEqual(['a', 'b']);
  });

  it('objectKeys() returns [] for null', () => {
    expect(component.objectKeys(null)).toEqual([]);
  });
});
