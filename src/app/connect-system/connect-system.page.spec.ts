import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectSystemPage } from './connect-system.page';

describe('ConnectSystemPage', () => {
  let component: ConnectSystemPage;
  let fixture: ComponentFixture<ConnectSystemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectSystemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectSystemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
