import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MSeguimientoComponent } from './m-seguimiento.component';


describe('MSeguimientoComponent', () => {
  let component: MSeguimientoComponent;
  let fixture: ComponentFixture<MSeguimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MSeguimientoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
