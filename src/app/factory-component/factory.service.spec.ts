import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FactoryService } from './factory.service';

describe('FactoryService', () => {
  let service: FactoryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FactoryService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FactoryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => expect(service).toBeTruthy());

  // ── Factories ─────────────────────────────────────────────

  it('registerFactory() hits POST /factories', () => {
    const body = { name: 'F1', locationX: 1, locationY: 2, assignedRecipeIds: [] };
    const res = { id: 'f1', name: 'F1', locationX: 1, locationY: 2, warehouseId: 'w1', recipeIds: [] };
    service.registerFactory(body).subscribe(d => expect(d).toEqual(res));
    const r = http.expectOne('http://localhost:8080/factories');
    expect(r.request.method).toBe('POST');
    r.flush(res);
  });

  it('findFactoryByProduct() hits GET /factories/:productId', () => {
    const res = { id: 'f1', name: 'F1', locationX: 1, locationY: 2, warehouseId: 'w1', recipeIds: [] };
    service.findFactoryByProduct('prod-1').subscribe(d => expect(d).toEqual(res));
    http.expectOne('http://localhost:8080/factories/prod-1').flush(res);
  });

  // ── Recipes ───────────────────────────────────────────────

  it('registerRecipe() hits POST /recipes', () => {
    const body = { name: 'Widget', inputs: [], outputProductId: 'p1', buildTimeInDays: 2 };
    service.registerRecipe(body).subscribe();
    const r = http.expectOne('http://localhost:8080/recipes');
    expect(r.request.method).toBe('POST');
    r.flush({ id: 'r1', ...body });
  });

  it('listRecipes() hits GET /recipes', () => {
    const mock = [{ id: 'r1', name: 'Widget', inputs: [], outputProductId: 'p1', buildTimeInDays: 2 }];
    service.listRecipes().subscribe(d => expect(d).toEqual(mock));
    http.expectOne('http://localhost:8080/recipes').flush(mock);
  });

  // ── Warehouse Orders ──────────────────────────────────────

  it('placeOrder() hits POST /warehouses/:id/orders', () => {
    const body = { productId: 'p1', quantity: 5 };
    service.placeOrder('w1', body).subscribe();
    const r = http.expectOne('http://localhost:8080/warehouses/w1/orders');
    expect(r.request.method).toBe('POST');
    expect(r.request.body).toEqual(body);
    r.flush({ orderId: 'o1', productionOrderId: 'po1', warehouseId: 'w1', productId: 'p1', factoryAssigned: 'f1', quantity: 5, status: 'PENDING' });
  });
});
