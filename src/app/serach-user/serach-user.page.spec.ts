import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerachUserPage } from './serach-user.page';

describe('SerachUserPage', () => {
  let component: SerachUserPage;
  let fixture: ComponentFixture<SerachUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerachUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerachUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
