import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurarClaveComponent } from './restaurarClave.component';


describe('RestaurarClaveComponent', () => {
  let component: RestaurarClaveComponent;
  let fixture: ComponentFixture<RestaurarClaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurarClaveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurarClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
