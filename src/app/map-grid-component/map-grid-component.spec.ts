import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MapGridComponent } from './map-grid-component';

describe('MapGridComponent', () => {
  let component: MapGridComponent;
  let fixture: ComponentFixture<MapGridComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapGridComponent],
      imports: [FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(MapGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // flush the HTTP calls triggered by ngOnInit
    http.expectOne('http://localhost:8080/map').flush({ trucks: [], warehouses: [] });
    http.expectOne('http://localhost:8081/tick/current').flush({ currentDay: 1 });
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise with 2500 cells', () => {
    expect(component.cells.length).toBe(2500);
  });

  it('isTruck() returns false for empty map', () => {
    expect(component.isTruck(0, 0)).toBeFalsy();
  });

  it('isWarehouse() returns false for empty map', () => {
    expect(component.isWarehouse(0, 0)).toBeFalsy();
  });
});
