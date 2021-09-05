import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QSeguimientoComponent } from './q-seguimiento.component';


describe('QSeguimientoComponent', () => {
  let component: QSeguimientoComponent;
  let fixture: ComponentFixture<QSeguimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QSeguimientoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
