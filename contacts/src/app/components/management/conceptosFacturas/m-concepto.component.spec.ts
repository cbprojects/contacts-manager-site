import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MConceptoFacturaComponent } from './m-concepto.component';


describe('MConceptoFacturaComponent', () => {
  let component: MConceptoFacturaComponent;
  let fixture: ComponentFixture<MConceptoFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MConceptoFacturaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MConceptoFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
