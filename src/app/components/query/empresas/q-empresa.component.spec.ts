import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QEmpresaComponent } from './q-empresa.component';


describe('QEmpresaComponent', () => {
  let component: QEmpresaComponent;
  let fixture: ComponentFixture<QEmpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QEmpresaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
