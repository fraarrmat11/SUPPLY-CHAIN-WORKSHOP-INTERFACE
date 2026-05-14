import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { TruckComponent } from './truck-component';
import { TruckService } from './truck.service';

const mockService = {
  findAll: vi.fn().mockReturnValue(of([])),
  register: vi.fn().mockReturnValue(of({})),
};

describe('TruckComponent', () => {
  let component: TruckComponent;
  let fixture: ComponentFixture<TruckComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockService.findAll.mockReturnValue(of([]));
    mockService.register.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [TruckComponent],
      imports: [FormsModule],
      providers: [{ provide: TruckService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('fetchAll() populates trucks', () => {
    const data = [{ truckId: 't1', status: 'IDLE', location: { x: 0, y: 0 } }];
    mockService.findAll.mockReturnValue(of(data));
    component.fetchAll();
    expect(component.trucks).toEqual(data);
    expect(component.loadingMap['list']).toBeFalsy();
  });

  it('fetchAll() sets error on failure', () => {
    mockService.findAll.mockReturnValue(throwError(() => new Error('net')));
    component.fetchAll();
    expect(component.errorMap['list']).toBe('net');
  });

  it('register() does nothing when name is empty', () => {
    component.nameInput = '';
    component.capacityInput = 10;
    component.register();
    expect(mockService.register).not.toHaveBeenCalled();
  });

  it('register() does nothing when capacity < 1', () => {
    component.nameInput = 'Truck-A';
    component.capacityInput = 0;
    component.register();
    expect(mockService.register).not.toHaveBeenCalled();
  });

  it('register() calls service and populates registered', () => {
    const res = { truckId: 'new', status: 'IDLE', location: { x: 0, y: 0 } };
    mockService.register.mockReturnValue(of(res));
    component.nameInput = 'Truck-A';
    component.capacityInput = 50;
    component.register();
    expect(mockService.register).toHaveBeenCalledWith({ name: 'Truck-A', capacity: 50 });
    expect(component.registered).toEqual(res);
  });

  it('register() sets error on failure', () => {
    mockService.register.mockReturnValue(throwError(() => new Error('400')));
    component.nameInput = 'Truck-A';
    component.capacityInput = 50;
    component.register();
    expect(component.errorMap['register']).toBe('400');
  });

  it('objectKeys() works for null', () => expect(component.objectKeys(null)).toEqual([]));
});
