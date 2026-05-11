import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGridComponent } from './map-grid-component';

describe('MapGridComponent', () => {
  let component: MapGridComponent;
  let fixture: ComponentFixture<MapGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapGridComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
