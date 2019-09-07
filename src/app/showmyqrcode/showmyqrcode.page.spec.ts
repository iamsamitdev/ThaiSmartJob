import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowmyqrcodePage } from './showmyqrcode.page';

describe('ShowmyqrcodePage', () => {
  let component: ShowmyqrcodePage;
  let fixture: ComponentFixture<ShowmyqrcodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowmyqrcodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowmyqrcodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
