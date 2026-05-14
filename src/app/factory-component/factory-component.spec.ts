import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { FactoryComponent } from './factory-component';
import { FactoryService } from './factory.service';

const mockFactory = { id: 'f1', name: 'F1', locationX: 1, locationY: 2, warehouseId: 'w1', recipeIds: [] };
const mockRecipe  = { id: 'r1', name: 'Widget', inputs: [], outputProductId: 'p1', buildTimeInDays: 2 };
const mockOrder   = { orderId: 'o1', productionOrderId: 'po1', warehouseId: 'w1', productId: 'p1', factoryAssigned: 'f1', quantity: 5, status: 'PENDING' };

const mockService = {
  registerFactory:      vi.fn().mockReturnValue(of(mockFactory)),
  findFactoryByProduct: vi.fn().mockReturnValue(of(mockFactory)),
  registerRecipe:       vi.fn().mockReturnValue(of(mockRecipe)),
  listRecipes:          vi.fn().mockReturnValue(of([])),
  placeOrder:           vi.fn().mockReturnValue(of(mockOrder)),
};

describe('FactoryComponent', () => {
  let component: FactoryComponent;
  let fixture: ComponentFixture<FactoryComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockService.registerFactory.mockReturnValue(of(mockFactory));
    mockService.findFactoryByProduct.mockReturnValue(of(mockFactory));
    mockService.registerRecipe.mockReturnValue(of(mockRecipe));
    mockService.listRecipes.mockReturnValue(of([]));
    mockService.placeOrder.mockReturnValue(of(mockOrder));

    await TestBed.configureTestingModule({
      declarations: [FactoryComponent],
      imports: [FormsModule],
      providers: [{ provide: FactoryService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  // ── registerFactory ───────────────────────────────────────

  it('registerFactory() sets error on invalid JSON', () => {
    component.factoryJson = 'bad';
    component.registerFactory();
    expect(component.errorMap['regFactory']).toBe('Invalid JSON');
    expect(mockService.registerFactory).not.toHaveBeenCalled();
  });

  it('registerFactory() calls service and sets registeredFactory', () => {
    component.factoryJson = '{"name":"F1","locationX":1,"locationY":2,"assignedRecipeIds":[]}';
    component.registerFactory();
    expect(component.registeredFactory).toEqual(mockFactory);
  });

  it('registerFactory() sets error on failure', () => {
    mockService.registerFactory.mockReturnValue(throwError(() => new Error('503')));
    component.factoryJson = '{"name":"F1","locationX":1,"locationY":2,"assignedRecipeIds":[]}';
    component.registerFactory();
    expect(component.errorMap['regFactory']).toBe('503');
  });

  // ── findFactoryByProduct ──────────────────────────────────

  it('findFactoryByProduct() does nothing when input is empty', () => {
    component.productIdInput = '';
    component.findFactoryByProduct();
    expect(mockService.findFactoryByProduct).not.toHaveBeenCalled();
  });

  it('findFactoryByProduct() populates factoryByProduct', () => {
    component.productIdInput = 'prod-1';
    component.findFactoryByProduct();
    expect(component.factoryByProduct).toEqual(mockFactory);
  });

  // ── registerRecipe ────────────────────────────────────────

  it('registerRecipe() sets error on invalid JSON', () => {
    component.recipeJson = '{bad}';
    component.registerRecipe();
    expect(component.errorMap['regRecipe']).toBe('Invalid JSON');
  });

  it('registerRecipe() calls service and sets registeredRecipe', () => {
    component.recipeJson = '{"name":"Widget","inputs":[],"outputProductId":"p1","buildTimeInDays":2}';
    component.registerRecipe();
    expect(component.registeredRecipe).toEqual(mockRecipe);
  });

  // ── listRecipes ───────────────────────────────────────────

  it('listRecipes() populates recipes', () => {
    mockService.listRecipes.mockReturnValue(of([mockRecipe]));
    component.listRecipes();
    expect(component.recipes).toEqual([mockRecipe]);
  });

  it('listRecipes() sets error on failure', () => {
    mockService.listRecipes.mockReturnValue(throwError(() => new Error('500')));
    component.listRecipes();
    expect(component.errorMap['recipes']).toBe('500');
  });

  // ── placeOrder ────────────────────────────────────────────

  it('placeOrder() does nothing when warehouseId is empty', () => {
    component.orderWarehouseIdInput = '';
    component.orderProductIdInput = 'p1';
    component.orderQuantityInput = 5;
    component.placeOrder();
    expect(mockService.placeOrder).not.toHaveBeenCalled();
  });

  it('placeOrder() does nothing when quantity < 1', () => {
    component.orderWarehouseIdInput = 'w1';
    component.orderProductIdInput = 'p1';
    component.orderQuantityInput = 0;
    component.placeOrder();
    expect(mockService.placeOrder).not.toHaveBeenCalled();
  });

  it('placeOrder() calls service and sets placedOrder', () => {
    component.orderWarehouseIdInput = 'w1';
    component.orderProductIdInput = 'p1';
    component.orderQuantityInput = 5;
    component.placeOrder();
    expect(mockService.placeOrder).toHaveBeenCalledWith('w1', { productId: 'p1', quantity: 5 });
    expect(component.placedOrder).toEqual(mockOrder);
  });

  it('placeOrder() sets error on failure', () => {
    mockService.placeOrder.mockReturnValue(throwError(() => new Error('503')));
    component.orderWarehouseIdInput = 'w1';
    component.orderProductIdInput = 'p1';
    component.orderQuantityInput = 5;
    component.placeOrder();
    expect(component.errorMap['order']).toBe('503');
  });

  it('objectKeys() returns [] for null', () => expect(component.objectKeys(null)).toEqual([]));
});
