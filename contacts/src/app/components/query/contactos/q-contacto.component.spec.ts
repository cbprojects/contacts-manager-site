import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QContactoComponent } from './q-contacto.component';


describe('QContactoComponent', () => {
  let component: QContactoComponent;
  let fixture: ComponentFixture<QContactoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QContactoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
