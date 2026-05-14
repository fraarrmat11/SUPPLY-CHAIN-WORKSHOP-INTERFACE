import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TruckService } from './truck.service';

describe('TruckService', () => {
  let service: TruckService;
  let http: HttpTestingController;
  const base = 'http://localhost:8080/trucks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TruckService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TruckService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('findAll() hits GET /trucks', () => {
    const mock = [{ truckId: 't1', status: 'IDLE', location: { x: 0, y: 0 } }];
    service.findAll().subscribe(d => expect(d).toEqual(mock));
    http.expectOne(base).flush(mock);
  });

  it('register() hits POST /trucks with correct body', () => {
    const req = { name: 'Truck-A', capacity: 100 };
    const res = { truckId: 'new', status: 'IDLE', location: { x: 0, y: 0 } };
    service.register(req).subscribe(d => expect(d).toEqual(res));
    const r = http.expectOne(base);
    expect(r.request.method).toBe('POST');
    expect(r.request.body).toEqual(req);
    r.flush(res);
  });
});
