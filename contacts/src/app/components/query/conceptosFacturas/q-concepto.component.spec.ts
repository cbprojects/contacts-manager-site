import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QConceptoFacturaComponent } from './q-concepto.component';


describe('QConceptoFacturaComponent', () => {
  let component: QConceptoFacturaComponent;
  let fixture: ComponentFixture<QConceptoFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QConceptoFacturaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QConceptoFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
