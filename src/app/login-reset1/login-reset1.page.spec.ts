import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginReset1Page } from './login-reset1.page';

describe('LoginReset1Page', () => {
  let component: LoginReset1Page;
  let fixture: ComponentFixture<LoginReset1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginReset1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginReset1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
