import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingtoolComponent } from './pricingtool.component';

describe('PricingtoolComponent', () => {
  let component: PricingtoolComponent;
  let fixture: ComponentFixture<PricingtoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingtoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingtoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
