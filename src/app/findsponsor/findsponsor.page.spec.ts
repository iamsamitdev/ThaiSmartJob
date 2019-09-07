import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindsponsorPage } from './findsponsor.page';

describe('FindsponsorPage', () => {
  let component: FindsponsorPage;
  let fixture: ComponentFixture<FindsponsorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindsponsorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindsponsorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
