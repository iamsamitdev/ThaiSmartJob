import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadNotiPage } from './read-noti.page';

describe('ReadNotiPage', () => {
  let component: ReadNotiPage;
  let fixture: ComponentFixture<ReadNotiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadNotiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadNotiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
