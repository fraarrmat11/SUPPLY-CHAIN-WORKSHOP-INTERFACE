import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { WarehouseComponent } from './warehouse-component';
import { WarehouseService } from './warehouse.service';

const mockService = {
  getAllWarehouses: vi.fn().mockReturnValue(of([])),
  getWarehouseById: vi.fn().mockReturnValue(of({})),
  saveWarehouse: vi.fn().mockReturnValue(of('Created')),
  updateWarehouse: vi.fn().mockReturnValue(of('Updated')),
  deleteWarehouse: vi.fn().mockReturnValue(of('Deleted')),
  findAvailableWarehouse: vi.fn().mockReturnValue(of({})),
  assignFactory: vi.fn().mockReturnValue(of('Assigned')),
};

describe('WarehouseComponent', () => {
  let component: WarehouseComponent;
  let fixture: ComponentFixture<WarehouseComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockService.getAllWarehouses.mockReturnValue(of([]));
    mockService.getWarehouseById.mockReturnValue(of({}));
    mockService.saveWarehouse.mockReturnValue(of('Created'));
    mockService.updateWarehouse.mockReturnValue(of('Updated'));
    mockService.deleteWarehouse.mockReturnValue(of('Deleted'));
    mockService.findAvailableWarehouse.mockReturnValue(of({}));
    mockService.assignFactory.mockReturnValue(of('Assigned'));

    await TestBed.configureTestingModule({
      declarations: [WarehouseComponent],
      imports: [FormsModule],
      providers: [{ provide: WarehouseService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── fetchAll ─────────────────────────────────────────────────

  it('fetchAll() populates warehouses', () => {
    const data = [{ id: '1', name: 'WH-A' }];
    mockService.getAllWarehouses.mockReturnValue(of(data));
    component.fetchAll();
    expect(component.warehouses).toEqual(data);
    expect(component.loadingMap['list']).toBeFalsy();
  });

  it('fetchAll() sets error on failure', () => {
    mockService.getAllWarehouses.mockReturnValue(throwError(() => new Error('500')));
    component.fetchAll();
    expect(component.errorMap['list']).toBe('500');
  });

  // ── fetchById ────────────────────────────────────────────────

  it('fetchById() does nothing when input is empty', () => {
    component.getByIdInput = '';
    component.fetchById();
    expect(mockService.getWarehouseById).not.toHaveBeenCalled();
  });

  it('fetchById() populates warehouseById', () => {
    const data = { id: '42', name: 'WH-42' };
    mockService.getWarehouseById.mockReturnValue(of(data));
    component.getByIdInput = '42';
    component.fetchById();
    expect(component.warehouseById).toEqual(data);
  });

  // ── fetchAvailable ───────────────────────────────────────────

  it('fetchAvailable() populates availableWarehouse', () => {
    const data = { id: '99', factoryId: null };
    mockService.findAvailableWarehouse.mockReturnValue(of(data));
    component.fetchAvailable();
    expect(component.availableWarehouse).toEqual(data);
  });

  // ── save ─────────────────────────────────────────────────────

  it('save() sets error when JSON is invalid', () => {
    component.saveJson = 'not-json';
    component.save();
    expect(component.errorMap['save']).toBe('Invalid JSON');
    expect(mockService.saveWarehouse).not.toHaveBeenCalled();
  });

  it('save() calls service with parsed body', () => {
    component.saveJson = '{"name":"WH-New"}';
    component.save();
    expect(mockService.saveWarehouse).toHaveBeenCalledWith({ name: 'WH-New' });
    expect(component.responseMessage).toBe('Created');
  });

  // ── update ───────────────────────────────────────────────────

  it('update() does nothing when id is empty', () => {
    component.updateIdInput = '';
    component.updateJson = '{"name":"x"}';
    component.update();
    expect(mockService.updateWarehouse).not.toHaveBeenCalled();
  });

  it('update() sets error when JSON is invalid', () => {
    component.updateIdInput = '1';
    component.updateJson = 'bad';
    component.update();
    expect(component.errorMap['update']).toBe('Invalid JSON');
  });

  it('update() calls service with id and parsed body', () => {
    component.updateIdInput = '1';
    component.updateJson = '{"name":"WH-Updated"}';
    component.update();
    expect(mockService.updateWarehouse).toHaveBeenCalledWith('1', { name: 'WH-Updated' });
    expect(component.responseMessage).toBe('Updated');
  });

  // ── delete ───────────────────────────────────────────────────

  it('delete() does nothing when input is empty', () => {
    component.deleteIdInput = '';
    component.delete();
    expect(mockService.deleteWarehouse).not.toHaveBeenCalled();
  });

  it('delete() calls service and sets responseMessage', () => {
    component.deleteIdInput = '5';
    component.delete();
    expect(mockService.deleteWarehouse).toHaveBeenCalledWith('5');
    expect(component.responseMessage).toBe('Deleted');
  });

  // ── assignFactory ────────────────────────────────────────────

  it('assignFactory() does nothing when inputs are empty', () => {
    component.assignWarehouseIdInput = '';
    component.assignFactoryIdInput = '';
    component.assignFactory();
    expect(mockService.assignFactory).not.toHaveBeenCalled();
  });

  it('assignFactory() calls service with warehouseId and factoryId', () => {
    component.assignWarehouseIdInput = 'w1';
    component.assignFactoryIdInput = 'f1';
    component.assignFactory();
    expect(mockService.assignFactory).toHaveBeenCalledWith('w1', { factoryId: 'f1' });
    expect(component.responseMessage).toBe('Assigned');
  });

  // ── objectKeys helper ────────────────────────────────────────

  it('objectKeys() returns keys of an object', () => {
    expect(component.objectKeys({ a: 1, b: 2 })).toEqual(['a', 'b']);
  });

  it('objectKeys() returns [] for null', () => {
    expect(component.objectKeys(null)).toEqual([]);
  });
});
