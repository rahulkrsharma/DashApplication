import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingfilesComponent } from './pricingfiles.component';

describe('PricingfilesComponent', () => {
  let component: PricingfilesComponent;
  let fixture: ComponentFixture<PricingfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
