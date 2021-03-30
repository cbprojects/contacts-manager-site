import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Guardian } from './Guardian';


describe('Guardian', () => {
  let component: Guardian;
  let fixture: ComponentFixture<Guardian>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Guardian]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Guardian);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});