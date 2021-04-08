import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QFacturaComponent } from './q-factura.component';


describe('QFacturaComponent', () => {
  let component: QFacturaComponent;
  let fixture: ComponentFixture<QFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QFacturaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
