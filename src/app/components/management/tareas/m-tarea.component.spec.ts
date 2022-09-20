import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MTareaComponent } from './m-tarea.component';


describe('MTareaComponent', () => {
  let component: MTareaComponent;
  let fixture: ComponentFixture<MTareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MTareaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
