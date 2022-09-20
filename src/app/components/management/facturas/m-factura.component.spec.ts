import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MFacturaComponent } from './m-factura.component';


describe('MFacturaComponent', () => {
  let component: MFacturaComponent;
  let fixture: ComponentFixture<MFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MFacturaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
