import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WarehouseService } from './warehouse.service';

describe('WarehouseService', () => {
  let service: WarehouseService;
  let http: HttpTestingController;
  const base = 'http://localhost:8080/warehouses';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WarehouseService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WarehouseService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllWarehouses() hits GET /warehouses/list', () => {
    const mock = [{ id: '1' }];
    service.getAllWarehouses().subscribe(d => expect(d).toEqual(mock));
    http.expectOne(`${base}/list`).flush(mock);
  });

  it('getWarehouseById() hits GET /warehouses/:id', () => {
    const mock = { id: '42' };
    service.getWarehouseById('42').subscribe(d => expect(d).toEqual(mock));
    http.expectOne(`${base}/42`).flush(mock);
  });

  it('saveWarehouse() hits POST /warehouses', () => {
    service.saveWarehouse({ name: 'WH' }).subscribe(d => expect(d).toBe('ok'));
    const req = http.expectOne(base);
    expect(req.request.method).toBe('POST');
    req.flush('ok');
  });

  it('updateWarehouse() hits PUT /warehouses/:id', () => {
    service.updateWarehouse('1', { name: 'WH' }).subscribe(d => expect(d).toBe('ok'));
    const req = http.expectOne(`${base}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('ok');
  });

  it('deleteWarehouse() hits DELETE /warehouses/:id', () => {
    service.deleteWarehouse('1').subscribe(d => expect(d).toBe('ok'));
    const req = http.expectOne(`${base}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush('ok');
  });

  it('findAvailableWarehouse() hits GET /warehouses/available', () => {
    const mock = { id: '99' };
    service.findAvailableWarehouse().subscribe(d => expect(d).toEqual(mock));
    http.expectOne(`${base}/available`).flush(mock);
  });

  it('assignFactory() hits PATCH /warehouses/assignFactory/:warehouseId', () => {
    service.assignFactory('w1', { factoryId: 'f1' }).subscribe(d => expect(d).toBe('ok'));
    const req = http.expectOne(`${base}/assignFactory/w1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ factoryId: 'f1' });
    req.flush('ok');
  });
});
