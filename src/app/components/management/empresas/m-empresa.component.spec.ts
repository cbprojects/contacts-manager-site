import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MEmpresaComponent } from './m-empresa.component';


describe('MEmpresaComponent', () => {
  let component: MEmpresaComponent;
  let fixture: ComponentFixture<MEmpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MEmpresaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
