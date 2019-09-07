import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastRegisterPage } from './last-register.page';

describe('LastRegisterPage', () => {
  let component: LastRegisterPage;
  let fixture: ComponentFixture<LastRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastRegisterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
