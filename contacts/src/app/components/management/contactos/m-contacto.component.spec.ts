import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MContactoComponent } from './m-contacto.component';


describe('MContactoComponent', () => {
  let component: MContactoComponent;
  let fixture: ComponentFixture<MContactoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MContactoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
