import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QTareaComponent } from './q-tarea.component';


describe('QTareaComponent', () => {
  let component: QTareaComponent;
  let fixture: ComponentFixture<QTareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QTareaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
